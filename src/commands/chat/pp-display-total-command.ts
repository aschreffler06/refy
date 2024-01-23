import { ChatInputCommandInteraction, PermissionsString } from 'discord.js';
import { RateLimiter } from 'discord.js-rate-limiter';

// import { OsuController } from '../../controllers/osu-controller.js';
import { Player, PpMatch } from '../../models/database/index.js';
import { Language } from '../../models/enum-helpers/index.js';
import { EventData } from '../../models/internal-models.js';
import { Lang } from '../../services/index.js';
import { InteractionUtils, PpLeaderboardUtils } from '../../utils/index.js';
import { Command, CommandDeferType } from '../index.js';

export class PpDisplayTotalCommand implements Command {
    public names = [Lang.getRef('chatCommands.ppDisplayTotal', Language.Default)];
    public cooldown = new RateLimiter(1, 5000);
    public deferType = CommandDeferType.PUBLIC;
    public requireClientPerms: PermissionsString[] = [];

    public async execute(intr: ChatInputCommandInteraction, _data: EventData): Promise<void> {
        const match = await PpMatch.findOne({ guildId: intr.guildId });
        const player = await Player.findOne({ discord: intr.user.id }).exec();
        const leaderboards = match.leaderboards;
        const currentLeaderboard = PpLeaderboardUtils.getPlayerLeaderboard(player, leaderboards);
        const scores = [];

        // add the pp of the plays to the map
        for (const score of currentLeaderboard.scores) {
            scores.push(score.pp);
        }

        // get the total pp for each team
        scores.sort((a, b) => b - a);
        let totalPp = 0;
        for (let i = 0; i < 100 && i < scores.length; i++) {
            totalPp += scores[i] * Math.pow(0.95, i);
        }

        let teamsString = `Range: ${currentLeaderboard.lowerRank} - ${currentLeaderboard.upperRank}\n\n`;

        teamsString += `Total Combined PP: **${totalPp.toFixed(2)}** pp\n`;
        await InteractionUtils.send(intr, teamsString);
    }
}
