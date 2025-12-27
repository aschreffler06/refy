import { ScoreCalculator } from '@kionell/osu-pp-calculator';
import { RateLimiter } from 'discord.js-rate-limiter';
import { MatchStatus, OsuMod, OsuMode } from '../../enums/index.js';
import { OsuScore, Player, PpMatch } from '../../models/database/index.js';
import { Language } from '../../models/enum-helpers/index.js';
import { Lang, OsuService } from '../../services/index.js';
import { InteractionUtils, PpLeaderboardUtils, ScoreManagementUtils } from '../../utils/index.js';
import { CommandDeferType } from '../index.js';
export class PpSubmitPlayCommand {
    constructor() {
        this.names = [Lang.getRef('chatCommands.ppSubmitPlay', Language.Default)];
        this.cooldown = new RateLimiter(1, 5000);
        this.deferType = CommandDeferType.PUBLIC;
        this.requireClientPerms = [];
    }
    //TODO: make it so you can submit a score id as well
    async execute(intr, data) {
        const args = {
            recent: intr.options.getNumber(Lang.getRef('arguments.recent', data.lang)),
            mode: intr.options.getString(Lang.getRef('arguments.mode', data.lang)),
        };
        const osuService = new OsuService();
        const mode = args.mode ?? OsuMode.STANDARD;
        const recentPlays = await osuService.getRecentPlays(intr.user.id, mode);
        const player = await Player.findOne({ discord: intr.user.id }).exec();
        let play;
        if (!args.recent) {
            play = recentPlays[0];
        }
        else if (args.recent <= recentPlays.length) {
            play = recentPlays[args.recent - 1];
        }
        else {
            await InteractionUtils.send(intr, `You don't have that many recent plays (Does not include fails)`);
            return;
        }
        const createdAt = Math.floor(new Date(play.createdAt).getTime());
        // TODO: write time range better later
        if (createdAt < 1766199600 || createdAt > 1768791600) {
            await InteractionUtils.send(intr, 'This play is not in the time range!');
            return;
        }
        if (play.status !== 'ranked' && play.status !== 'approved') {
            await InteractionUtils.send(intr, 'This beatmap is not ranked!');
            return;
        }
        const bannedMaps = [1376308, 1127002]; //set ids
        if (bannedMaps.includes(Number(play.beatmapSetId))) {
            await InteractionUtils.send(intr, 'This beatmap set is banned from leaderboards');
            return;
        }
        let pp;
        if (!play.pp) {
            const scoreCalculator = new ScoreCalculator();
            let result;
            if (args.mode === OsuMode.STANDARD) {
                result = await scoreCalculator.calculate({
                    beatmapId: Number(play.beatmapId),
                    mods: play.mods.join(''),
                    accuracy: play.accuracy,
                    count300: play.count300,
                    count100: play.count100,
                    count50: play.count50,
                    countMiss: play.countMiss,
                    maxCombo: play.maxCombo,
                    rulesetId: 0,
                });
            }
            else if (args.mode === OsuMode.TAIKO) {
                result = await scoreCalculator.calculate({
                    beatmapId: Number(play.beatmapId),
                    mods: play.mods.join(''),
                    accuracy: play.accuracy,
                    count300: play.count300,
                    count100: play.count100,
                    countMiss: play.countMiss,
                    maxCombo: play.maxCombo,
                    rulesetId: 1,
                });
            }
            else if (args.mode === OsuMode.CATCH) {
                result = await scoreCalculator.calculate({
                    beatmapId: Number(play.beatmapId),
                    mods: play.mods.join(''),
                    accuracy: play.accuracy,
                    count300: play.count300,
                    count100: play.count100,
                    count50: play.count50,
                    countMiss: play.countMiss,
                    maxCombo: play.maxCombo,
                    rulesetId: 2,
                });
            }
            else if (args.mode === OsuMode.MANIA) {
                result = await scoreCalculator.calculate({
                    beatmapId: Number(play.beatmapId),
                    mods: play.mods.join(''),
                    accuracy: play.accuracy,
                    count300: play.count300,
                    count100: play.count100,
                    count50: play.count50,
                    countMiss: play.countMiss,
                    maxCombo: play.maxCombo,
                    rulesetId: 3,
                });
            }
            pp = result.performance.totalPerformance;
        }
        else {
            pp = play.pp;
        }
        const score = new OsuScore({
            _id: play.id,
            userId: player._id,
            accuracy: play.accuracy,
            count300: play.count300,
            count100: play.count100,
            count50: play.count50,
            countMiss: play.countMiss,
            maxCombo: play.maxCombo,
            beatmapMaxCombo: play.beatmapMaxCombo,
            difficulty: play.difficulty,
            pp: pp,
            rank: play.rank,
            score: play.score,
            mods: play.mods,
            created_at: play.createdAt,
            mode: play.mode,
            passed: play.passed,
            beatmapId: play.beatmapId,
            beatmapSetId: play.beatmapSetId,
            status: play.status,
            title: play.title,
            version: play.version,
            url: play.url,
            list: play.list,
            teamName: '',
        });
        // Get the active match for this guild
        const match = await PpMatch.findOne({
            guildId: intr.guildId,
            status: MatchStatus.ACTIVE,
        }).exec();
        if (!match) {
            await InteractionUtils.send(intr, 'There is no active match in progress for this server!');
            return;
        }
        // Find which team the player submitting is on
        const team = match.teams.find(t => t.players.find(p => p._id === player._id));
        if (!team) {
            await InteractionUtils.send(intr, 'You are not on any team in the current match. Please join a team first using `/pp-join-team`.');
            return;
        }
        score.teamName = team.name;
        // Add to score leaderboard
        const playerRank = await Player.findById(score.userId)
            .exec()
            .then(p => p.rank);
        const scoreLb = match.scoreLeaderboards.find(lb => lb.mode === mode && lb.lowerRank <= playerRank && lb.upperRank >= playerRank);
        if (scoreLb && scoreLb.mode === mode) {
            // find if score already exists and check the total score value
            const existingIndex = scoreLb.scores.findIndex(s => String(s.beatmapId) === String(score.beatmapId));
            if (existingIndex !== -1) {
                const existingScore = scoreLb.scores[existingIndex];
                if ((score.score ?? 0) > (existingScore.score ?? 0)) {
                    // new score is higher — remove the old and add the new
                    scoreLb.scores.splice(existingIndex, 1);
                    scoreLb.scores.push(score);
                }
            }
            else {
                scoreLb.scores.push(score);
            }
        }
        // Apply PP multipliers BEFORE saving to database
        if (mode === OsuMode.STANDARD) {
            if (score.mods.includes(OsuMod.EZ)) {
                if (score.mods.includes(OsuMod.DT) || score.mods.includes(OsuMod.NC)) {
                    score.pp *= 1.3;
                }
                else if (score.mods.includes(OsuMod.HT)) {
                    score.pp *= 1.6;
                }
                else {
                    score.pp *= 1.5;
                }
            }
            else {
                if (score.mods.includes(OsuMod.DT) || score.mods.includes(OsuMod.NC)) {
                    score.pp *= 0.9;
                }
                if (score.mods.includes(OsuMod.HT)) {
                    score.pp *= 1.3;
                }
            }
        }
        else if (mode === OsuMode.TAIKO) {
            if (score.mods.includes(OsuMod.HR)) {
                if (score.mods.includes(OsuMod.HD)) {
                    score.pp *= 1.1;
                }
                else {
                    score.pp *= 0.95;
                }
            }
        }
        else if (mode === OsuMode.MANIA) {
            if (score.mods.includes(OsuMod.EZ)) {
                if (score.mods.includes(OsuMod.HT)) {
                    score.pp *= 0.8;
                }
                else {
                    score.pp *= 0.9;
                }
            }
            else if (score.mods.includes(OsuMod.HT)) {
                score.pp *= 0.9;
            }
        }
        const leaderboards = match.leaderboards;
        let currLeaderboard = PpLeaderboardUtils.getPlayerLeaderboard(player, leaderboards, mode);
        if (!currLeaderboard) {
            await InteractionUtils.send(intr, {
                content: 'No leaderboard found for your rank range and mode.',
                ephemeral: true,
            });
            return;
        }
        // Calculate current team pp before adding the new score
        const oldPp = ScoreManagementUtils.calculateTeamPp(currLeaderboard, score.teamName);
        // Let score management handle everything (including an early check for an existing higher score)
        const result = ScoreManagementUtils.manageActiveScoresOnAdd(currLeaderboard, score);
        // Calculate new team pp using only active scores
        const newPp = ScoreManagementUtils.calculateTeamPp(currLeaderboard, score.teamName);
        const scoreEmbed = await PpLeaderboardUtils.createScoreEmbed(player, score, currLeaderboard, oldPp, newPp);
        // Save with retry logic to handle concurrent updates
        const maxRetries = 5;
        let retryCount = 0;
        let saved = false;
        while (!saved && retryCount < maxRetries) {
            try {
                await match.save();
                saved = true;
            }
            catch (error) {
                if (error.name === 'VersionError' && retryCount < maxRetries - 1) {
                    retryCount++;
                    // Exponential backoff: wait 50ms, 100ms, 200ms, 400ms
                    await new Promise(resolve => setTimeout(resolve, 50 * Math.pow(2, retryCount - 1)));
                    // Re-fetch the document and re-apply the changes
                    const freshMatch = await PpMatch.findOne({
                        guildId: intr.guildId,
                        status: MatchStatus.ACTIVE,
                    }).exec();
                    if (!freshMatch) {
                        throw new Error('Match was deleted during save operation');
                    }
                    // Re-apply score to score leaderboards
                    const freshScoreLb = freshMatch.scoreLeaderboards.find(lb => lb.mode === mode &&
                        lb.lowerRank <= playerRank &&
                        lb.upperRank >= playerRank);
                    if (freshScoreLb && freshScoreLb.mode === mode) {
                        const existingIndex = freshScoreLb.scores.findIndex(s => String(s.beatmapId) === String(score.beatmapId));
                        if (existingIndex !== -1) {
                            const existingScore = freshScoreLb.scores[existingIndex];
                            if ((score.score ?? 0) > (existingScore.score ?? 0)) {
                                freshScoreLb.scores.splice(existingIndex, 1);
                                freshScoreLb.scores.push(score);
                            }
                        }
                        else {
                            freshScoreLb.scores.push(score);
                        }
                    }
                    // Re-apply score to main leaderboards
                    currLeaderboard = PpLeaderboardUtils.getPlayerLeaderboard(player, freshMatch.leaderboards, mode);
                    if (!currLeaderboard) {
                        throw new Error('Leaderboard disappeared during save operation');
                    }
                    ScoreManagementUtils.manageActiveScoresOnAdd(currLeaderboard, score);
                    // Update match reference for next save attempt
                    Object.assign(match, freshMatch);
                }
                else {
                    throw error;
                }
            }
        }
        if (!saved) {
            await InteractionUtils.send(intr, {
                content: 'Failed to save score after multiple attempts. Please try again.',
                ephemeral: true,
            });
            return;
        }
        if (result.event.type === 'existingHigher') {
            const existing = result.event.otherScore;
            const existingPlayer = await Player.findOne({ _id: existing.userId }).exec();
            const embed = await PpLeaderboardUtils.createScoreEmbed(existingPlayer, existing, currLeaderboard);
            await InteractionUtils.send(intr, {
                content: 'There is already a higher score on this beatmap set on the leaderboard.',
                ephemeral: true,
                embeds: [embed],
            });
            return;
        }
        // Send appropriate message based on score-management's event (sniped etc.)
        let message = undefined;
        if (result &&
            result.event &&
            result.event.type === 'sniped' &&
            score.userId !== result.event.otherScore.userId) {
            message = `You've sniped a score on this beatmap set!`;
            Player.findOne({ _id: result.event.otherScore.userId }).then(async (otherPlayer) => {
                if (!otherPlayer)
                    return;
                const notify = otherPlayer.notifyOnSnipe ?? false;
                if (notify) {
                    // send to the match.updateschannelid
                    const guild = await intr.client.guilds.fetch(String(match.guildId));
                    if (!guild)
                        return;
                    const channel = await guild.channels.fetch(String(match.updatesChannelId));
                    if (!channel || !channel.isTextBased())
                        return;
                    const otherScoreEmbed = await PpLeaderboardUtils.createScoreEmbed(otherPlayer, result.event.otherScore, currLeaderboard);
                    await channel.send({
                        content: `<@${otherPlayer.discord}>, your top score on this beatmap set has been sniped!`,
                        embeds: [otherScoreEmbed],
                    });
                }
            });
        }
        await InteractionUtils.send(intr, {
            content: message,
            embeds: [scoreEmbed],
            ephemeral: false,
        });
    }
}
//# sourceMappingURL=pp-submit-play-command.js.map