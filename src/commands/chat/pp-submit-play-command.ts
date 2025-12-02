import { ScoreCalculator } from '@kionell/osu-pp-calculator';
import { ChatInputCommandInteraction, PermissionsString } from 'discord.js';
import { RateLimiter } from 'discord.js-rate-limiter';

import { MatchStatus, OsuMod, OsuMode } from '../../enums/index.js';
import { OsuScoreDTO } from '../../models/data-objects/index.js';
import { OsuScore, Player, PpMatch } from '../../models/database/index.js';
import { Language } from '../../models/enum-helpers/index.js';
import { EventData } from '../../models/internal-models.js';
import { Lang, OsuService } from '../../services/index.js';
import { InteractionUtils, PpLeaderboardUtils, ScoreManagementUtils } from '../../utils/index.js';
import { Command, CommandDeferType } from '../index.js';

export class PpSubmitPlayCommand implements Command {
    public names = [Lang.getRef('chatCommands.ppSubmitPlay', Language.Default)];
    public cooldown = new RateLimiter(1, 5000);
    public deferType = CommandDeferType.PUBLIC;
    public requireClientPerms: PermissionsString[] = [];

    //TODO: make it so you can submit a score id as well
    public async execute(intr: ChatInputCommandInteraction, data: EventData): Promise<void> {
        const args = {
            recent: intr.options.getNumber(Lang.getRef('arguments.recent', data.lang)),
            mode: intr.options.getString(Lang.getRef('arguments.mode', data.lang)),
        };

        const osuService = new OsuService();
        const mode = (args.mode as OsuMode) ?? OsuMode.STANDARD;
        const recentPlays = await osuService.getRecentPlays(intr.user.id, mode);
        const player = await Player.findOne({ discord: intr.user.id }).exec();

        let play: OsuScoreDTO;
        if (!args.recent) {
            play = recentPlays[0];
        } else if (args.recent <= recentPlays.length) {
            play = recentPlays[args.recent - 1];
        } else {
            await InteractionUtils.send(
                intr,
                `You don't have that many recent plays (Does not include fails)`
            );
            return;
        }

        // TODO: write time range better later
        if (play.createdAt < 1736136000 || play.createdAt > 17379468000) {
            await InteractionUtils.send(intr, 'This play is not in the time range!');
            return;
        }

        if (play.status !== 'ranked' && play.status !== 'approved') {
            await InteractionUtils.send(intr, 'This beatmap is not ranked!');
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
            } else if (args.mode === OsuMode.TAIKO) {
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
            } else if (args.mode === OsuMode.CATCH) {
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
            } else if (args.mode === OsuMode.MANIA) {
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
        } else {
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
            await InteractionUtils.send(
                intr,
                'There is no active match in progress for this server!'
            );
            return;
        }

        // Find which team the player submitting is on
        const team = match.teams.find(t => t.players.find(p => p._id === player._id));
        if (!team) {
            await InteractionUtils.send(
                intr,
                'You are not on any team in the current match. Please join a team first using `/pp-join-team`.'
            );
            return;
        }

        // Apply PP multipliers BEFORE saving to database
        if (score.mods.includes(OsuMod.EZ)) {
            if (score.mods.includes(OsuMod.DT) || score.mods.includes(OsuMod.NC)) {
                score.pp *= 1.2;
            } else if (score.mods.includes(OsuMod.HT)) {
                score.pp *= 1.6;
            } else {
                score.pp *= 1.5;
            }
        }

        if (score.mods.includes(OsuMod.DT) || score.mods.includes(OsuMod.NC)) {
            score.pp *= 0.9;
        }

        if (score.mods.includes(OsuMod.HT)) {
            score.pp *= 1.3;
        }

        try {
            await score.save();
        } catch (err) {
            if (err.code === 11000) {
                await InteractionUtils.send(intr, 'You have already submitted this play.');
                return;
            } else {
                console.log(err);
                await InteractionUtils.send(
                    intr,
                    'Something went wrong. Please try again later or contact the host.'
                );
                return;
            }
        }

        score.teamName = team.name;

        const leaderboards = match.leaderboards;
        let currLeaderboard = PpLeaderboardUtils.getPlayerLeaderboard(player, leaderboards, mode);

        if (!currLeaderboard) {
            await InteractionUtils.send(intr, {
                content: 'No leaderboard found for your rank range and mode.',
                ephemeral: true,
            });
            return;
        }

        // Check for existing score by this player on the same beatmap set (should be max 1)
        const existingPlayerScore = currLeaderboard.scores.find(
            s => s.userId === score.userId && s.beatmapSetId === score.beatmapSetId
        );

        if (existingPlayerScore) {
            // If player already has a higher score, reject the submission
            if (existingPlayerScore.pp >= score.pp) {
                const oldPlayer = await Player.findOne({ _id: existingPlayerScore.userId }).exec();
                await InteractionUtils.send(intr, {
                    content: 'You already have a higher score on this beatmap set.',
                    ephemeral: true,
                    embeds: [
                        await PpLeaderboardUtils.createScoreEmbed(
                            oldPlayer,
                            existingPlayerScore,
                            currLeaderboard
                        ),
                    ],
                });
                return;
            }

            // Remove the lower existing score
            const index = currLeaderboard.scores.indexOf(existingPlayerScore);
            currLeaderboard.scores.splice(index, 1);
        }

        // find if there is any score that matches the same beatmap set (for sniping display)
        const oldScore = PpLeaderboardUtils.getScoreOnLeaderboard(
            currLeaderboard,
            score.beatmapSetId
        );

        // Calculate current team pp before adding the new score
        const oldPp = ScoreManagementUtils.calculateTeamPp(currLeaderboard, score.teamName);

        // Let score management handle everything (adding score, active status, ownership, etc.)
        const modifiedScores = ScoreManagementUtils.manageActiveScoresOnAdd(currLeaderboard, score);

        // Save only the scores that had their isActive status changed
        const savePromises = modifiedScores.map((s: any) => s.save());
        await Promise.all(savePromises);

        // Calculate new team pp using only active scores
        const newPp = ScoreManagementUtils.calculateTeamPp(currLeaderboard, score.teamName);

        const scoreEmbed = await PpLeaderboardUtils.createScoreEmbed(
            player,
            score,
            currLeaderboard,
            oldPp,
            newPp
        );

        await match.save();

        // Send appropriate message based on whether this was a snipe
        const message =
            oldScore && oldScore.pp < score.pp
                ? `You've sniped a score on this beatmap set!`
                : undefined;

        await InteractionUtils.send(intr, {
            content: message,
            embeds: [scoreEmbed],
            ephemeral: false,
        });
    }
}
