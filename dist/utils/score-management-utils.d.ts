import { IOsuScore } from '../models/database/osu-score.js';
/**
 * Utility class for managing active scores in a competitive leaderboard system
 */
export declare class ScoreManagementUtils {
    private static readonly MAX_PLAYER_ACTIVE_SCORES;
    private static readonly MAX_TEAM_SCORES;
    /**
     * Main entry point for managing active scores when a new score is added
     * @param leaderboard The leaderboard containing all scores
     * @param newScore The newly added score
     * @returns Array of scores that had their isActive status changed
     */
    static manageActiveScoresOnAdd(leaderboard: any, newScore: IOsuScore): any;
    /**
     * Resolves all cascading changes until the system is stable
     * @param leaderboard The leaderboard containing all scores
     * @param initialAffectedBeatmaps The initially affected beatmaps
     */
    private static resolveAllChanges;
    /**
     * Applies the 10-score limit per player and returns affected beatmaps
     * @param leaderboard The leaderboard containing all scores
     * @param userId ID of the player to check limits for
     */
    private static applyPlayerLimitsAndGetAffectedBeatmaps;
    /**
     * Resolves beatmap set ownership based on team performance
     * @param leaderboard The leaderboard containing all scores
     * @param beatmapSetId ID of the beatmap set to resolve ownership for
     * @returns Set of player IDs whose active status changed
     */
    private static resolveBeatmapOwnership;
    /**
     * Gets active scores for display, sorted by pp
     * @param leaderboard The leaderboard to get scores from
     * @param limit Maximum number of scores to return for display
     */
    static getDisplayScores(leaderboard: any, limit?: number): IOsuScore[];
    /**
     * Calculates team pp using only active scores (top 150 for calculation)
     * @param leaderboard The leaderboard
     * @param teamName Team to calculate pp for
     */
    static calculateTeamPp(leaderboard: any, teamName: string): number;
}
