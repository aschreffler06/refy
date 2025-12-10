import { RateLimiter } from 'discord.js-rate-limiter';
// import { OsuController } from '../../controllers/osu-controller.js';
import { MatchStatus, OsuMode } from '../../enums/index.js';
import { Player, PpMatch } from '../../models/database/index.js';
import { Language } from '../../models/enum-helpers/index.js';
import { Lang } from '../../services/index.js';
import { InteractionUtils, PpLeaderboardUtils, ScoreManagementUtils } from '../../utils/index.js';
import { CommandDeferType } from '../index.js';
export class PpDisplayTotalCommand {
    constructor() {
        this.names = [Lang.getRef('chatCommands.ppDisplayTotal', Language.Default)];
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
        // Get only active scores and calculate total pp
        const activeScores = ScoreManagementUtils.getDisplayScores(currentLeaderboard);
        let totalPp = 0;
        activeScores.forEach((score, index) => {
            totalPp += score.pp * Math.pow(0.98, index);
        });
        let teamsString = `Range: ${currentLeaderboard.lowerRank} - ${currentLeaderboard.upperRank}\n\n`;
        teamsString += `Total Combined PP: **${totalPp.toFixed(2)}** pp\n`;
        await InteractionUtils.send(intr, teamsString);
    }
}
//# sourceMappingURL=pp-display-total-command.js.map