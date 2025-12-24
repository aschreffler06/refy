import { ChatInputCommandInteraction, PermissionsString } from 'discord.js';
import { RateLimiter } from 'discord.js-rate-limiter';

import { BountyWinCondition, MatchStatus, OsuMod, OsuMode } from '../../enums/index.js';
import { OsuScoreDTO } from '../../models/data-objects/index.js';
import { OsuScore, Player, PpMatch } from '../../models/database/index.js';
import { Language } from '../../models/enum-helpers/index.js';
import { EventData } from '../../models/internal-models.js';
import { Lang, OsuService } from '../../services/index.js';
import { InteractionUtils } from '../../utils/index.js';
import { Command, CommandDeferType } from '../index.js';

export class PpSubmitBountyCommand implements Command {
    public names = [Lang.getRef('chatCommands.ppSubmitBounty', Language.Default)];
    public cooldown = new RateLimiter(1, 5000);
    public deferType = CommandDeferType.HIDDEN;
    public requireClientPerms: PermissionsString[] = [];

    public async execute(intr: ChatInputCommandInteraction, data: EventData): Promise<void> {
        const args = {
            recent: intr.options.getNumber(Lang.getRef('arguments.recent', data.lang)),
            mode: intr.options.getString(Lang.getRef('arguments.mode', data.lang)),
        };

        const osuService = new OsuService();
        const mode = (args.mode as OsuMode) ?? OsuMode.STANDARD;
        const recentPlays = await osuService.getRecentPlays(intr.user.id, mode);
        const player = await Player.findOne({ discord: intr.user.id }).exec();

        if (!player) {
            await InteractionUtils.send(intr, {
                content: 'You are not registered as a player. Use `/link` to register first.',
                ephemeral: true,
            });
            return;
        }

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

        if (!play) {
            await InteractionUtils.send(intr, 'No recent plays were found.');
            return;
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
            pp: play.pp,
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
            await InteractionUtils.send(intr, {
                content:
                    'You are not on any team in the current match. Please join a team first using `/pp-join-team`.',
                ephemeral: true,
            });
            return;
        }

        // Find if the map has an active bounty
        const beatmapBounty = match.bounties.find(
            b => b.beatmapId === score.beatmapId && b.isActive
        );

        if (!beatmapBounty) {
            await InteractionUtils.send(
                intr,
                'There is no active bounty for this beatmap in the current match.'
            );
            return;
        }
        // check if the play meets the mod requirement (mods array length 0 = NM, 1 = modded, and more than 1 should only be FM (check for HD HR or BOTH))
        const playModsSet = new Set(play.mods);
        const bountyMod = beatmapBounty.mod;
        let bountyModMet = false;
        switch (bountyMod) {
            case OsuMod.NM:
                if (play.mods.length === 0) {
                    bountyModMet = true;
                }
                break;
            case OsuMod.HD:
                if (play.mods.length === 1 && playModsSet.has(OsuMod.HD)) {
                    bountyModMet = true;
                }
                break;
            case OsuMod.HR:
                if (play.mods.length === 1 && playModsSet.has(OsuMod.HR)) {
                    bountyModMet = true;
                }
                break;
            case OsuMod.DT:
                if (
                    play.mods.length === 1 &&
                    (playModsSet.has(OsuMod.DT) || playModsSet.has(OsuMod.NC))
                ) {
                    bountyModMet = true;
                }
                break;
            case OsuMod.EZ:
                if (play.mods.length === 1 && playModsSet.has(OsuMod.EZ)) {
                    bountyModMet = true;
                }
                break;
            case OsuMod.FM:
                if (
                    play.mods.length === 2 &&
                    playModsSet.has(OsuMod.HD) &&
                    playModsSet.has(OsuMod.HR)
                ) {
                    bountyModMet = true;
                }
                if (
                    play.mods.length === 1 &&
                    (playModsSet.has(OsuMod.HD) || playModsSet.has(OsuMod.HR))
                ) {
                    bountyModMet = true;
                }
                if (play.mods.length === 0) {
                    bountyModMet = true;
                }
                break;
            case OsuMod.FoM:
                if (
                    play.mods.length === 2 &&
                    playModsSet.has(OsuMod.HD) &&
                    playModsSet.has(OsuMod.HR)
                ) {
                    bountyModMet = true;
                }
                if (
                    play.mods.length === 1 &&
                    (playModsSet.has(OsuMod.HD) || playModsSet.has(OsuMod.HR))
                ) {
                    bountyModMet = true;
                }
                break;
        }
        if (!bountyModMet) {
            await InteractionUtils.send(
                intr,
                `Your play does not meet the mod requirement for the bounty (Required: ${bountyMod}, Your Mods: ${
                    play.mods.length > 0 ? play.mods.join('') : 'NM'
                })`
            );
            return;
        }
        // switch case for each win condition and check if it is met
        let bountyWon = false;
        switch (beatmapBounty.winCondition) {
            case BountyWinCondition.ACCURACY:
                bountyWon = true;
                break;
            case BountyWinCondition.SCORE:
                if (score.score >= beatmapBounty.value) {
                    bountyWon = true;
                }
                break;
            case BountyWinCondition.MISS_COUNT:
                if (score.countMiss <= beatmapBounty.value) {
                    bountyWon = true;
                }
                break;
            case BountyWinCondition.PASS:
                if (score.passed) {
                    bountyWon = true;
                }
                break;
            case BountyWinCondition.COMBO:
                if (score.maxCombo >= beatmapBounty.value) {
                    bountyWon = true;
                }
                break;
        }
        if (bountyWon) {
            // Set the team name before adding to scores
            score.teamName = team.name;

            let scores = beatmapBounty.scores;
            // beatmapBounty.isActive = false;

            // Check if player already has a score submitted
            const existingScoreIndex = scores.findIndex(s => s.userId === player._id.toString());

            if (existingScoreIndex !== -1) {
                const existingScore = scores[existingScoreIndex];
                let isNewScoreBetter = false;

                // Compare based on win condition
                switch (beatmapBounty.winCondition) {
                    case BountyWinCondition.ACCURACY:
                        isNewScoreBetter =
                            score.accuracy > existingScore.accuracy ||
                            (score.accuracy === existingScore.accuracy &&
                                score.created_at < existingScore.created_at);
                        break;
                    case BountyWinCondition.SCORE:
                        isNewScoreBetter =
                            score.score > existingScore.score ||
                            (score.score === existingScore.score &&
                                score.created_at < existingScore.created_at);
                        break;
                    case BountyWinCondition.MISS_COUNT:
                        isNewScoreBetter =
                            score.countMiss < existingScore.countMiss ||
                            (score.countMiss === existingScore.countMiss &&
                                score.created_at < existingScore.created_at);
                        break;
                    case BountyWinCondition.PASS:
                        isNewScoreBetter = score.created_at < existingScore.created_at;
                        break;
                    case BountyWinCondition.COMBO:
                        isNewScoreBetter =
                            score.maxCombo > existingScore.maxCombo ||
                            (score.maxCombo === existingScore.maxCombo &&
                                score.created_at < existingScore.created_at);
                        break;
                }

                if (isNewScoreBetter) {
                    // Remove the old score
                    scores.splice(existingScoreIndex, 1);
                } else {
                    // Don't add the new score
                    await InteractionUtils.send(
                        intr,
                        `You have already submitted a better or equal score for this bounty. Your existing score remains on the leaderboard.`
                    );
                    return;
                }
            }

            switch (beatmapBounty.winCondition) {
                case BountyWinCondition.ACCURACY:
                    // add bounty to scores and cut anything after the 11th sorted by accuracy descending
                    scores.push(score);
                    scores.sort((a, b) => {
                        const diff = b.accuracy - a.accuracy;
                        if (diff !== 0) return diff;
                        return a.created_at - b.created_at;
                    });
                    break;
                case BountyWinCondition.SCORE:
                    scores.push(score);
                    scores.sort((a, b) => {
                        const diff = b.score - a.score;
                        if (diff !== 0) return diff;
                        return a.created_at - b.created_at;
                    });
                    break;
                case BountyWinCondition.MISS_COUNT:
                    scores.push(score);
                    scores.sort((a, b) => {
                        const diff = a.countMiss - b.countMiss;
                        if (diff !== 0) return diff;
                        return a.created_at - b.created_at;
                    });
                    break;
                case BountyWinCondition.PASS:
                    scores.push(score);
                    scores.sort((a, b) => {
                        const diff = a.created_at - b.created_at;
                        return diff;
                    });
                    break;
                case BountyWinCondition.COMBO:
                    scores.push(score);
                    scores.sort((a, b) => {
                        const diff = b.maxCombo - a.maxCombo;
                        if (diff !== 0) return diff;
                        return a.created_at - b.created_at;
                    });
                    break;
            }
            if (scores.length > 11) {
                scores = scores.slice(0, 11);
            }

            // Check if the score made it into the top 11 by comparing IDs
            const scoreInTop11 = scores.some(s => s._id.toString() === score._id.toString());
            if (!scoreInTop11) {
                await InteractionUtils.send(
                    intr,
                    `Your play was good enough to meet the bounty condition, but not high enough to be in the top 11 for this bounty`
                );
                return;
            }
            beatmapBounty.winningTeam = scores[0].teamName;
            await match.save();

            // Find the score's position in the leaderboard by ID
            const scorePosition =
                scores.findIndex(s => s._id.toString() === score._id.toString()) + 1;

            await InteractionUtils.send(
                intr,
                `Congratulations! Your play has met the bounty condition for **${play.title} [${play.version}]**! The bounty is now claimed for your team **${team.name}** at #${scorePosition} on the leaderboard.`
            );
        } else {
            await InteractionUtils.send(
                intr,
                `Your play did not meet the bounty condition for **${play.title} [${play.version}]**. Better luck next time.`
            );
        }
    }
}
