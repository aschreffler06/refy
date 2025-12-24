import { RateLimiter } from 'discord.js-rate-limiter';
// import { OsuController } from '../../controllers/osu-controller.js';
import { MatchStatus, OsuMode } from '../../enums/index.js';
import { Player, PpMatch } from '../../models/database/index.js';
import { Language } from '../../models/enum-helpers/index.js';
import { Lang } from '../../services/index.js';
import { InteractionUtils, PpLeaderboardUtils, ScoreManagementUtils } from '../../utils/index.js';
import { CommandDeferType } from '../index.js';
export class PpDisplayCommand {
    constructor() {
        this.names = [Lang.getRef('chatCommands.ppDisplay', Language.Default)];
        this.cooldown = new RateLimiter(1, 5000);
        this.deferType = CommandDeferType.PUBLIC;
        this.requireClientPerms = [];
    }
    async execute(intr, data) {
        const args = {
            mode: intr.options.getString(Lang.getRef('arguments.mode', data.lang)),
        };
        const mode = args.mode ?? OsuMode.STANDARD;
        const match = await PpMatch.findOne({
            guildId: intr.guildId,
            status: MatchStatus.ACTIVE,
        }).exec();
        const player = await Player.findOne({ discord: intr.user.id }).exec();
        const leaderboards = match.leaderboards;
        const currentLeaderboard = PpLeaderboardUtils.getPlayerLeaderboard(player, leaderboards, mode);
        if (!currentLeaderboard) {
            await InteractionUtils.send(intr, {
                content: `No leaderboard found for your rank range and mode ${mode}.`,
                ephemeral: true,
            });
            return;
        }
        const teamPpMap = new Map();
        for (const team of match.teams) {
            const teamPp = ScoreManagementUtils.calculateTeamPp(currentLeaderboard, team.name);
            teamPpMap.set(team.name, teamPp);
        }
        let teamsString = `Range: ${currentLeaderboard.lowerRank} - ${currentLeaderboard.upperRank}\n\n`;
        for (const [teamName, pp] of teamPpMap) {
            teamsString += `${teamName}: **${pp.toFixed(2)}** pp\n`;
        }
        await InteractionUtils.send(intr, teamsString);
    }
}
//# sourceMappingURL=pp-display-command.js.map