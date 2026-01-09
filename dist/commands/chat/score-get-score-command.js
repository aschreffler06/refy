import { RateLimiter } from 'discord.js-rate-limiter';
import { MatchStatus, OsuMode } from '../../enums/index.js';
import { Player, PpMatch } from '../../models/database/index.js';
import { Language } from '../../models/enum-helpers/index.js';
import { Lang } from '../../services/index.js';
import { InteractionUtils, PpLeaderboardUtils } from '../../utils/index.js';
import { CommandDeferType } from '../index.js';
export class ScoreGetScoreCommand {
    constructor() {
        this.names = [Lang.getRef('chatCommands.scoreGetScore', Language.Default)];
        this.cooldown = new RateLimiter(1, 5000);
        this.deferType = CommandDeferType.NONE;
        this.requireClientPerms = [];
    }
    async execute(intr, data) {
        const args = {
            id: intr.options.getString(Lang.getRef('arguments.id', data.lang)),
            mode: intr.options.getString(Lang.getRef('arguments.mode', data.lang)),
        };
        const mode = args.mode ?? OsuMode.STANDARD;
        const match = await PpMatch.findOne({
            guildId: intr.guildId,
            status: MatchStatus.ACTIVE,
        }).exec();
        if (!match) {
            await InteractionUtils.send(intr, 'Match not found!');
            return;
        }
        const player = await Player.findOne({ discord: intr.user.id }).exec();
        const playerRank = player.rank;
        const scoreLb = match.scoreLeaderboards.find(lb => lb.mode === mode && lb.lowerRank <= playerRank && lb.upperRank >= playerRank);
        const score = scoreLb.scores.find(s => s.beatmapId.toString() === args.id);
        if (!score) {
            await InteractionUtils.send(intr, 'Score not found!');
            return;
        }
        const scoreEmbed = await PpLeaderboardUtils.createScoreEmbed(player, score, scoreLb);
        await InteractionUtils.send(intr, scoreEmbed);
    }
}
//# sourceMappingURL=score-get-score-command.js.map