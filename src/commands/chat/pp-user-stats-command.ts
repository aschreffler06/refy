import { ChatInputCommandInteraction, PermissionsString } from 'discord.js';
import { RateLimiter } from 'discord.js-rate-limiter';

import { Player, PpMatch } from '../../models/database/index.js';
import { Language } from '../../models/enum-helpers/index.js';
import { EventData } from '../../models/internal-models.js';
import { Lang } from '../../services/index.js';
import { InteractionUtils, PpLeaderboardUtils } from '../../utils/index.js';
import { Command, CommandDeferType } from '../index.js';

export class PpUserStatsCommand implements Command {
    public names = [Lang.getRef('chatCommands.ppUserStats', Language.Default)];
    public cooldown = new RateLimiter(1, 5000);
    public deferType = CommandDeferType.PUBLIC;
    public requireClientPerms: PermissionsString[] = [];

    public async execute(intr: ChatInputCommandInteraction, _data: EventData): Promise<void> {
        const match = await PpMatch.findOne({ guildId: intr.guildId });
        const player = await Player.findOne({ discord: intr.user.id }).exec();
        const leaderboard = PpLeaderboardUtils.getPlayerLeaderboard(player, match.leaderboards);

        let scores = leaderboard.scores;
        scores.sort((a, b) => b.pp - a.pp);
        let teamPp = 0;
        let totalPlays = 0;
        for (let i = 0; i < scores.length && i < 100; i++) {
            console.log(scores[i]);
            if (scores[i].userId == player.id) {
                teamPp += scores[i].pp * Math.pow(0.95, i);
                totalPlays += 1;
            }
        }

        await InteractionUtils.send(
            intr,
            `You have ${totalPlays} plays worth **${teamPp.toFixed(2)}** pp for your leaderboard!`
        );
    }
}
