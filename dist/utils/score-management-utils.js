/**
 * Utility class for managing active scores in a competitive leaderboard system
 */
export class ScoreManagementUtils {
    /**
     * Main entry point for managing active scores when a new score is added
     * @param leaderboard The leaderboard containing all scores
     * @param newScore The newly added score
     * @returns Array of scores that had their isActive status changed
     */
    static manageActiveScoresOnAdd(leaderboard, newScore) {
        // Quick pre-check: if there's already an active score on this beatmap set
        // with pp >= the submitted pp, reject early to avoid unnecessary work.
        const topExisting = leaderboard.scores
            .filter((s) => s.beatmapSetId === newScore.beatmapSetId && s.isActive)
            .sort((a, b) => b.pp - a.pp)[0];
        if (topExisting && topExisting.pp >= newScore.pp) {
            return { event: { type: 'existingHigher', otherScore: topExisting } };
        }
        // Activate the new score
        newScore.isActive = true;
        // Add the score to the leaderboard
        leaderboard.scores.push(newScore);
        // Store initial active states of all scores (including the new one)
        const initialStates = new Map();
        for (const score of leaderboard.scores) {
            initialStates.set(score._id, score.isActive);
        }
        // Apply player limits and get affected beatmaps
        const affectedBeatmaps = this.applyPlayerLimitsAndGetAffectedBeatmaps(leaderboard, newScore.userId);
        // Add the new score's beatmap to affected list
        affectedBeatmaps.add(newScore.beatmapSetId);
        // Keep processing until no more changes occur
        this.resolveAllChanges(leaderboard, affectedBeatmaps);
        // Capture the highest active score on this beatmap set after changes
        const topAfter = leaderboard.scores
            .filter((s) => s.beatmapSetId === newScore.beatmapSetId && s.isActive)
            .sort((a, b) => b.pp - a.pp)[0] || null;
        // Determine if a snipe occurred: an existing top active score was replaced
        let event = { type: 'none' };
        if (topExisting && topAfter && topExisting._id !== topAfter._id) {
            event = { type: 'sniped', otherScore: topExisting };
        }
        return { event, affectedBeatmaps: Array.from(affectedBeatmaps) };
    }
    /**
     * Resolves all cascading changes until the system is stable
     * @param leaderboard The leaderboard containing all scores
     * @param initialAffectedBeatmaps The initially affected beatmaps
     */
    static resolveAllChanges(leaderboard, initialAffectedBeatmaps) {
        const toProcess = new Set(initialAffectedBeatmaps);
        let iterationCount = 0;
        const maxIterations = 50; // Prevent infinite loops
        while (toProcess.size > 0 && iterationCount < maxIterations) {
            iterationCount++;
            const currentBeatmap = toProcess.values().next().value;
            toProcess.delete(currentBeatmap);
            // Resolve ownership for this beatmap
            const newlyAffectedPlayers = this.resolveBeatmapOwnership(leaderboard, currentBeatmap);
            // Check if any affected players now need their limits re-applied
            for (const playerId of newlyAffectedPlayers) {
                const playerAffectedBeatmaps = this.applyPlayerLimitsAndGetAffectedBeatmaps(leaderboard, playerId);
                // Add newly affected beatmaps to processing queue
                for (const beatmapSetId of playerAffectedBeatmaps) {
                    toProcess.add(beatmapSetId);
                }
            }
        }
        if (iterationCount >= maxIterations) {
            console.warn('ScoreManagementUtils: Maximum iterations reached, system may be unstable');
        }
    }
    /**
     * Applies the 10-score limit per player and returns affected beatmaps
     * @param leaderboard The leaderboard containing all scores
     * @param userId ID of the player to check limits for
     */
    static applyPlayerLimitsAndGetAffectedBeatmaps(leaderboard, userId) {
        const affectedBeatmaps = new Set();
        const playerScores = leaderboard.scores
            .filter((score) => score.userId === userId && score.isActive)
            .sort((a, b) => b.pp - a.pp);
        // If player exceeds limits, deactivate excess scores (should be at most 1 in normal operation)
        if (playerScores.length > this.MAX_PLAYER_ACTIVE_SCORES) {
            const excessScores = playerScores.slice(this.MAX_PLAYER_ACTIVE_SCORES);
            for (const score of excessScores) {
                score.isActive = false;
                affectedBeatmaps.add(score.beatmapSetId);
            }
        }
        return affectedBeatmaps;
    }
    /**
     * Resolves beatmap set ownership based on team performance
     * @param leaderboard The leaderboard containing all scores
     * @param beatmapSetId ID of the beatmap set to resolve ownership for
     * @returns Set of player IDs whose active status changed
     */
    static resolveBeatmapOwnership(leaderboard, beatmapSetId) {
        const affectedPlayers = new Set();
        // Get all scores for this beatmap set, sorted by pp
        const beatmapSetScores = leaderboard.scores
            .filter((score) => score.beatmapSetId === beatmapSetId)
            .sort((a, b) => b.pp - a.pp);
        if (beatmapSetScores.length === 0)
            return affectedPlayers;
        // Deactivate all scores first
        for (const score of beatmapSetScores) {
            if (score.isActive) {
                score.isActive = false;
                affectedPlayers.add(score.userId);
            }
        }
        // Find the team with the highest score (determines ownership)
        const highestScore = beatmapSetScores[0];
        const owningTeam = highestScore.teamName;
        // Find the highest score from the owning team where the player can actually have it active
        const eligibleScore = beatmapSetScores
            .filter(score => score.teamName === owningTeam)
            .find(score => {
            const playerActiveScores = leaderboard.scores.filter((s) => s.userId === score.userId && s.isActive);
            return playerActiveScores.length < this.MAX_PLAYER_ACTIVE_SCORES;
        });
        if (eligibleScore) {
            eligibleScore.isActive = true;
            affectedPlayers.add(eligibleScore.userId);
        }
        return affectedPlayers;
    }
    /**
     * Gets active scores for display, sorted by pp
     * @param leaderboard The leaderboard to get scores from
     * @param limit Maximum number of scores to return for display
     */
    static getDisplayScores(leaderboard, limit = 50) {
        return leaderboard.scores
            .filter((score) => score.isActive)
            .sort((a, b) => b.pp - a.pp)
            .slice(0, limit);
    }
    /**
     * Calculates team pp using only active scores (top 150 for calculation)
     * @param leaderboard The leaderboard
     * @param teamName Team to calculate pp for
     */
    static calculateTeamPp(leaderboard, teamName) {
        const activeTeamScores = leaderboard.scores
            .filter((score) => score.isActive && score.teamName === teamName)
            .sort((a, b) => b.pp - a.pp)
            .slice(0, this.MAX_TEAM_SCORES); // Only use top 150 for pp calculation
        let totalPp = 0;
        activeTeamScores.forEach((score, index) => {
            totalPp += score.pp * Math.pow(0.98, index);
        });
        return totalPp;
    }
}
ScoreManagementUtils.MAX_PLAYER_ACTIVE_SCORES = 10;
ScoreManagementUtils.MAX_TEAM_SCORES = 150; // For pp calculation
//# sourceMappingURL=score-management-utils.js.map