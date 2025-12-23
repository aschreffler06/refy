import { RateLimiter } from 'discord.js-rate-limiter';
import { BountyWinCondition, MatchStatus, OsuMod, OsuMode } from '../../enums/index.js';
import { OsuScore, Player, PpMatch } from '../../models/database/index.js';
import { Language } from '../../models/enum-helpers/index.js';
import { Lang, OsuService } from '../../services/index.js';
import { InteractionUtils } from '../../utils/index.js';
import { CommandDeferType } from '../index.js';
export class PpSubmitBountyCommand {
    constructor() {
        this.names = [Lang.getRef('chatCommands.ppSubmitBounty', Language.Default)];
        this.cooldown = new RateLimiter(1, 5000);
        this.deferType = CommandDeferType.HIDDEN;
        this.requireClientPerms = [];
    }
    async execute(intr, data) {
        const args = {
            recent: intr.options.getNumber(Lang.getRef('arguments.recent', data.lang)),
            mode: intr.options.getString(Lang.getRef('arguments.mode', data.lang)),
        };
        const osuService = new OsuService();
        const mode = args.mode ?? OsuMode.STANDARD;
        const recentPlays = await osuService.getRecentPlays(intr.user.id, mode);
        const player = await Player.findOne({ discord: intr.user.id }).exec();
        if (!player) {
            await InteractionUtils.send(intr, {
                content: 'You are not registered as a player. Use `/link` to register first.',
                ephemeral: true,
            });
            return;
        }
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
        if (!play) {
            await InteractionUtils.send(intr, 'No recent plays were found.');
            return;
        }
        const score = new OsuScore({
            _id: play.id,
            userId: player._id,
            accuracy: play.accuracy,
            countMiss: play.countMiss,
            maxCombo: play.maxCombo,
            rank: play.rank,
            score: play.score,
            mods: play.mods,
            created_at: play.createdAt,
            mode: play.mode,
            passed: play.passed,
            beatmapId: play.beatmapId,
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
            await InteractionUtils.send(intr, {
                content: 'You are not on any team in the current match. Please join a team first using `/pp-join-team`.',
                ephemeral: true,
            });
            return;
        }
        // Find if the map has an active bounty
        const beatmapBounty = match.bounties.find(b => b.beatmapId === score.beatmapId && b.isActive);
        if (!beatmapBounty) {
            await InteractionUtils.send(intr, 'There is no active bounty for this beatmap in the current match.');
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
                if (play.mods.length === 1 &&
                    (playModsSet.has(OsuMod.DT) || playModsSet.has(OsuMod.NC))) {
                    bountyModMet = true;
                }
                break;
            case OsuMod.EZ:
                if (play.mods.length === 1 && playModsSet.has(OsuMod.EZ)) {
                    bountyModMet = true;
                }
                break;
            case OsuMod.FM:
                if (play.mods.length === 2 &&
                    playModsSet.has(OsuMod.HD) &&
                    playModsSet.has(OsuMod.HR)) {
                    bountyModMet = true;
                }
                if (play.mods.length === 1 &&
                    (playModsSet.has(OsuMod.HD) || playModsSet.has(OsuMod.HR))) {
                    bountyModMet = true;
                }
                break;
        }
        if (!bountyModMet) {
            await InteractionUtils.send(intr, `Your play does not meet the mod requirement for the bounty (Required: ${bountyMod}, Your Mods: ${play.mods.length > 0 ? play.mods.join('') : 'NM'})`);
            return;
        }
        // switch case for each win condition and check if it is met
        let bountyWon = false;
        switch (beatmapBounty.winCondition) {
            case BountyWinCondition.ACCURACY:
                if (score.accuracy >= beatmapBounty.value) {
                    bountyWon = true;
                }
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
            // beatmapBounty.isActive = false;
            beatmapBounty.winningTeam = team.name;
            await match.save();
            await InteractionUtils.send(intr, `Congratulations! Your play has met the bounty condition for **${play.title} [${play.version}]**! The bounty is now claimed for your team **${team.name}**!`);
        }
        else {
            await InteractionUtils.send(intr, `Your play did not meet the bounty condition for **${play.title} [${play.version}]**. Better luck next time!`);
        }
    }
}
//# sourceMappingURL=pp-submit-bounty-command.js.map