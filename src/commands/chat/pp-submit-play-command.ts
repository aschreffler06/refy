import { ScoreCalculator } from '@kionell/osu-pp-calculator';
import { ChatInputCommandInteraction, PermissionsString } from 'discord.js';
import { RateLimiter } from 'discord.js-rate-limiter';

import { OsuController } from '../../controllers/osu-controller.js';
import { OsuMod } from '../../enums/index.js';
import { OsuScoreDTO } from '../../models/data-objects/index.js';
import { OsuScore, Player, PpMatch } from '../../models/database/index.js';
import { Language } from '../../models/enum-helpers/index.js';
import { EventData } from '../../models/internal-models.js';
import { Lang } from '../../services/index.js';
import { InteractionUtils, PpLeaderboardUtils } from '../../utils/index.js';
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
        if (!args.mode) {
            args.mode = 'osu';
        }
        const osuController = new OsuController();
        const recentPlays = await osuController.getRecentPlays(intr.user.id, args.mode);
        const player = await Player.findOne({ discord: intr.user.id }).exec();

        let play: OsuScoreDTO;
        if (!args.recent) {
            play = recentPlays[0];
        } else if (args.recent <= recentPlays.length) {
            play = recentPlays[args.recent - 1];
        } else {
            await InteractionUtils.send(
                intr,
                `You don't have that many recent plays! (Does not include fails)`
            );
        }
        //TODO: write this better

        if (play.createdAt < 1736136000 || play.createdAt > 1737860400) {
            InteractionUtils.send(intr, 'This play is not in the time range!');
            return;
        }

        // if (play.mode !== 'osu') {
        //     await InteractionUtils.send(intr, 'This play is not in osu! standard!');
        //     return;
        // }

        if (play.status !== 'ranked' && play.status !== 'approved') {
            await InteractionUtils.send(intr, 'This beatmap is not ranked!');
            return;
        }

        let pp;
        if (!play.pp) {
            const scoreCalculator = new ScoreCalculator();
            let result;
            if (args.mode === 'osu') {
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
            } else if (args.mode === 'taiko') {
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
            } else if (args.mode === 'fruits') {
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
            } else if (args.mode === 'mania') {
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
            status: play.status,
            title: play.title,
            version: play.version,
            url: play.url,
            list: play.list,
            teamName: '',
        });

        //TODO: MAKE NOT NAME HARDCODED
        const match = await PpMatch.findOne({ name: 'AESA' }).exec();
        // const match = await PpMatch.findOne({ guildId: intr.guildId }).exec();

        //TODO: generalize error messages for things like this
        if (!match) {
            await InteractionUtils.send(intr, 'There is no match going in this server!');
            return;
        }

        // find which team the player submitting is on and then add this to that team's scores array
        const team = match.teams.find(t => t.players.find(p => p._id === player._id));
        if (!team) {
            await InteractionUtils.send(
                intr,
                'You are not on either team or something went wrong! Please make sure you are on a team or contact the host.'
            );
            return;
        }

        try {
            await score.save();
        } catch (err) {
            if (err.code === 11000) {
                await InteractionUtils.send(intr, 'You have already submitted this play!');
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
        let currLeaderboard;
        if (play.mode !== 'osu') {
            // await InteractionUtils.send(intr, 'This play is not in osu! standard!');
            // return;
            currLeaderboard = leaderboards[5];
        } else {
            currLeaderboard = PpLeaderboardUtils.getPlayerLeaderboard(player, leaderboards);
        }

        // find if there is any score that matches the same map

        const oldScore = PpLeaderboardUtils.getMapOnLeaderbaord(currLeaderboard, score.beatmapId);

        if (score.mods.includes(OsuMod.EZ)) {
            if (score.mods.includes(OsuMod.DT) || score.mods.includes(OsuMod.NC)) {
                score.pp *= 1.25;
            } else {
                score.pp *= 1.5;
            }
        }

        let allScores = currLeaderboard.scores
            .filter(s => s.teamName === score.teamName)
            .sort((a, b) => b.pp - a.pp);

        allScores.sort((a, b) => b - a);
        let oldPp = 0;
        for (let i = 0; i < 100 && i < allScores.length; i++) {
            let pp = allScores[i].pp * Math.pow(0.95, i);
            oldPp += pp;
        }

        if (oldScore) {
            const oldPlayer = await Player.findOne({ _id: oldScore.userId }).exec();
            if (oldScore.pp < score.pp) {
                currLeaderboard.scores.splice(currLeaderboard.scores.indexOf(oldScore), 1);
                currLeaderboard.scores.push(score);

                let allScoresNew = currLeaderboard.scores
                    .filter(s => s.teamName === score.teamName)
                    .sort((a, b) => b.pp - a.pp);

                allScores.sort((a, b) => b - a);
                let newPp = 0;
                for (let i = 0; i < 100 && i < allScoresNew.length; i++) {
                    newPp += allScoresNew[i].pp * Math.pow(0.95, i);
                }

                await InteractionUtils.send(intr, {
                    content: `You've just sniped this score!`,
                    ephemeral: true,
                    embeds: [
                        PpLeaderboardUtils.createScoreEmbed(
                            oldPlayer,
                            oldScore,
                            currLeaderboard,
                            oldPp,
                            newPp
                        ),
                    ],
                });
            } else {
                await InteractionUtils.send(intr, {
                    content: 'Sorry but this score is already worth more pp.',
                    ephemeral: true,
                    embeds: [
                        PpLeaderboardUtils.createScoreEmbed(oldPlayer, oldScore, currLeaderboard),
                    ],
                });
                return;
            }
        } else {
            currLeaderboard.scores.push(score);
        }
        let allScoresNew = currLeaderboard.scores
            .filter(s => s.teamName === score.teamName)
            .sort((a, b) => b.pp - a.pp);

        allScores.sort((a, b) => b - a);
        let newPp = 0;
        for (let i = 0; i < 100 && i < allScoresNew.length; i++) {
            newPp += allScoresNew[i].pp * Math.pow(0.95, i);
        }
        const scoreEmbed = PpLeaderboardUtils.createScoreEmbed(
            player,
            score,
            currLeaderboard,
            oldPp,
            newPp
        );

        await match.save();

        await InteractionUtils.send(intr, { embeds: [scoreEmbed], ephemeral: false });
    }
}
