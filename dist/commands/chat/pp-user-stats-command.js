import { RateLimiter } from 'discord.js-rate-limiter';
import { MatchStatus, OsuMode } from '../../enums/index.js';
import { Player, PpMatch } from '../../models/database/index.js';
import { Language } from '../../models/enum-helpers/index.js';
import { Lang } from '../../services/index.js';
import { InteractionUtils, PpLeaderboardUtils } from '../../utils/index.js';
import { CommandDeferType } from '../index.js';
export class PpUserStatsCommand {
    constructor() {
        this.names = [Lang.getRef('chatCommands.ppUserStats', Language.Default)];
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
        const leaderboard = PpLeaderboardUtils.getPlayerLeaderboard(player, match.leaderboards, mode);
        let scores = leaderboard.scores;
        let teamName = '';
        for (let i = 0; i < scores.length; i++) {
            if (scores[i].userId == player.id) {
                teamName = scores[i].teamName;
                break;
            }
        }
        scores = scores.filter(score => score.teamName === teamName).sort((a, b) => b.pp - a.pp);
        let totalPp = 0;
        let totalPlays = 0;
        for (let i = 0; i < scores.length && i < 100; i++) {
            if (scores[i].userId == player.id) {
                totalPp += scores[i].pp * Math.pow(0.98, i);
                totalPlays += 1;
            }
        }
        await InteractionUtils.send(intr, `You have ${totalPlays} plays worth **${totalPp.toFixed(2)}** pp for your leaderboard!`);
    }
}
//# sourceMappingURL=pp-user-stats-command.js.map