import { RateLimiter } from 'discord.js-rate-limiter';
import { MatchStatus, OsuMode } from '../../enums/index.js';
import { Player, PpMatch } from '../../models/database/index.js';
import { Language } from '../../models/enum-helpers/index.js';
import { Lang } from '../../services/index.js';
import { InteractionUtils } from '../../utils/index.js';
import { CommandDeferType } from '../index.js';
export class ScoreUserStatsCommand {
    constructor() {
        this.names = [Lang.getRef('chatCommands.scoreUserStats', Language.Default)];
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
        const playerRank = player.rank;
        const scoreLb = match.scoreLeaderboards.find(lb => lb.mode === mode && lb.lowerRank <= playerRank && lb.upperRank >= playerRank);
        let scores = scoreLb.scores;
        let teamName = '';
        for (let i = 0; i < scores.length; i++) {
            if (scores[i].userId == player.id) {
                teamName = scores[i].teamName;
                break;
            }
        }
        scores = scores.filter(score => score.teamName === teamName);
        let totalScore = 0;
        let totalPlays = 0;
        for (const score of scores) {
            if (score.userId == player.id) {
                totalScore += score.score;
                totalPlays += 1;
            }
        }
        await InteractionUtils.send(intr, `You have ${totalPlays} plays worth **${totalScore.toFixed(2)}** score for your leaderboard!`);
    }
}
//# sourceMappingURL=score-user-stats-command.js.map