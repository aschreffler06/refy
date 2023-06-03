import { ScoreCalculator } from '@kionell/osu-pp-calculator';
import { ChatInputCommandInteraction, EmbedBuilder, PermissionsString } from 'discord.js';
import { RateLimiter } from 'discord.js-rate-limiter';

import { OsuController } from '../../controllers/osu-controller.js';
import { OsuScoreDTO } from '../../models/data-objects/index.js';
import { OsuScore, Player, PpMatch } from '../../models/database/index.js';
import { Language } from '../../models/enum-helpers/index.js';
import { EventData } from '../../models/internal-models.js';
import { Lang } from '../../services/index.js';
import { InteractionUtils } from '../../utils/index.js';
import { Command, CommandDeferType } from '../index.js';

export class PpSubmitPlayCommand implements Command {
    public names = [Lang.getRef('chatCommands.ppSubmitPlay', Language.Default)];
    public cooldown = new RateLimiter(1, 5000);
    public deferType = CommandDeferType.NONE;
    public requireClientPerms: PermissionsString[] = [];

    //TODO: make it so you can submit a score id as well
    public async execute(intr: ChatInputCommandInteraction, data: EventData): Promise<void> {
        const args = {
            recent: intr.options.getNumber(Lang.getRef('arguments.recent', data.lang)),
        };
        const osuController = new OsuController();
        const recentPlays = await osuController.getRecentPlays(intr.user.id);
        const player = await Player.findOne({ discord: intr.user.id }).exec();
        let scoreEmbed = new EmbedBuilder().setTitle('Submitted Play').setAuthor({
            name: player.username,
            iconURL: player.avatar,
            url: `https://osu.ppy.sh/users/${player._id}`,
        });
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
        if (play.createdAt < 1685750400) {
            InteractionUtils.send(intr, 'This play is too old to submit!');
            return;
        }

        if (play.status !== 'ranked') {
            await InteractionUtils.send(intr, 'This beatmap is not ranked!');
            return;
        }

        let pp;
        if (!play.pp) {
            const scoreCalculator = new ScoreCalculator();

            const result = await scoreCalculator.calculate({
                beatmapId: Number(play.beatmapId),
                mods: play.mods.join(),
                accuracy: play.accuracy,
                count300: play.count300,
                count100: play.count100,
                count50: play.count50,
                countMiss: play.countMiss,
                maxCombo: play.maxCombo,
            });
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
            pp: pp,
            rank: play.rank,
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
        });

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

        // find which team the player submitting is on and then add this to that team's scores array
        const match = await PpMatch.findOne({ guildId: intr.guildId }).exec();

        if (match.team1.players.find(p => p._id === player._id)) {
            //TODO: refactor into method but im really busy right now
            // check the beatmap ids of all the scores and compare to the beatmap id of the score, store the one with the top pp value
            for (let i = 0; i < match.team1.scores.length; i++) {
                let oldScore = match.team1.scores[i];
                if (oldScore.beatmapId === score.beatmapId) {
                    if (oldScore.pp < score.pp) {
                        match.team1.scores.splice(i, 1);
                    } else {
                        await InteractionUtils.send(intr, {
                            content:
                                'You have already submitted a score for this beatmap with a higher pp value!',
                            ephemeral: true,
                        });
                        return;
                    }
                }
            }

            match.team1.scores.push(score);
            await match.save();
        } else if (match.team2.players.find(p => p._id === player._id)) {
            // check the beatmap ids of all the scores
            for (let i = 0; i < match.team2.scores.length; i++) {
                let oldScore = match.team2.scores[i];
                if (oldScore.beatmapId === score.beatmapId) {
                    if (oldScore.pp < score.pp) {
                        match.team2.scores.splice(i, 1);
                    } else {
                        await InteractionUtils.send(intr, {
                            content:
                                'You have already submitted a score for this beatmap with a higher pp value!',
                            ephemeral: true,
                        });
                        return;
                    }
                }
            }

            match.team2.scores.push(score);
            await match.save();
        } else {
            await InteractionUtils.send(
                intr,
                'You are not on either team! Please contact the host.'
            );
            return;
        }

        const mods = play.mods.length > 0 ? play.mods.join('') : 'NM';
        if (mods.includes('EZ')) {
            if (mods.includes('DT')) {
                score.pp *= 1.25;
            } else {
                score.pp *= 1.5;
            }
        }

        scoreEmbed
            .addFields({
                name: `${score.title} [${score.version}] +**${mods}**`,
                value: `${score.pp.toFixed(2)} pp for ${(score.accuracy * 100).toFixed(2)}%`,
            })
            .setThumbnail(score.list);
        await InteractionUtils.send(intr, { embeds: [scoreEmbed], ephemeral: false });
    }
}
