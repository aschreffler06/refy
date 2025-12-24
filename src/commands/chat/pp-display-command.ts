import { ChatInputCommandInteraction, PermissionsString } from 'discord.js';
import { RateLimiter } from 'discord.js-rate-limiter';

// import { OsuController } from '../../controllers/osu-controller.js';
import { MatchStatus, OsuMode } from '../../enums/index.js';
import { Player, PpMatch } from '../../models/database/index.js';
import { Language } from '../../models/enum-helpers/index.js';
import { EventData } from '../../models/internal-models.js';
import { Lang } from '../../services/index.js';
import { InteractionUtils, PpLeaderboardUtils, ScoreManagementUtils } from '../../utils/index.js';
import { Command, CommandDeferType } from '../index.js';

export class PpDisplayCommand implements Command {
    public names = [Lang.getRef('chatCommands.ppDisplay', Language.Default)];
    public cooldown = new RateLimiter(1, 5000);
    public deferType = CommandDeferType.PUBLIC;
    public requireClientPerms: PermissionsString[] = [];

    public async execute(intr: ChatInputCommandInteraction, data: EventData): Promise<void> {
        const args = {
            mode: intr.options.getString(Lang.getRef('arguments.mode', data.lang)),
        };

        const mode = (args.mode as OsuMode) ?? OsuMode.STANDARD;
        const match = await PpMatch.findOne({
            guildId: intr.guildId,
            status: MatchStatus.ACTIVE,
        }).exec();
        const player = await Player.findOne({ discord: intr.user.id }).exec();
        const leaderboards = match.leaderboards;
        const currentLeaderboard = PpLeaderboardUtils.getPlayerLeaderboard(
            player,
            leaderboards,
            mode
        );

        if (!currentLeaderboard) {
            await InteractionUtils.send(intr, {
                content: `No leaderboard found for your rank range and mode ${mode}.`,
                ephemeral: true,
            });
            return;
        }

        const teamPpMap = new Map<string, number>();
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
