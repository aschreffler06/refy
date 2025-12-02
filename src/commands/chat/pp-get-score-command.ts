import { ChatInputCommandInteraction, PermissionsString } from 'discord.js';
import { RateLimiter } from 'discord.js-rate-limiter';

import { MatchStatus, OsuMode } from '../../enums/index.js';
import { Player, PpMatch } from '../../models/database/index.js';
import { Language } from '../../models/enum-helpers/index.js';
import { EventData } from '../../models/internal-models.js';
import { Lang } from '../../services/index.js';
import { InteractionUtils, PpLeaderboardUtils } from '../../utils/index.js';
import { Command, CommandDeferType } from '../index.js';

export class PpGetScoreCommand implements Command {
    public names = [Lang.getRef('chatCommands.ppGetScore', Language.Default)];
    public cooldown = new RateLimiter(1, 5000);
    public deferType = CommandDeferType.NONE;
    public requireClientPerms: PermissionsString[] = [];

    public async execute(intr: ChatInputCommandInteraction, data: EventData): Promise<void> {
        const args = {
            id: intr.options.getString(Lang.getRef('arguments.id', data.lang)),
            mode: intr.options.getString(Lang.getRef('arguments.mode', data.lang)),
        };

        const mode = (args.mode as OsuMode) ?? OsuMode.STANDARD;
        const match = await PpMatch.findOne({
            guildId: intr.guildId,
            status: MatchStatus.ACTIVE,
        }).exec();
        if (!match) {
            await InteractionUtils.send(intr, 'Match not found!');
            return;
        }

        const player = await Player.findOne({ discord: intr.user.id }).exec();
        const leaderboards = match.leaderboards;

        const currLeaderboard = PpLeaderboardUtils.getPlayerLeaderboard(player, leaderboards, mode);
        const score = PpLeaderboardUtils.getScoreOnLeaderboard(currLeaderboard, args.id);
        if (!score) {
            await InteractionUtils.send(intr, 'Score not found!');
            return;
        }
        const scoreEmbed = await PpLeaderboardUtils.createScoreEmbed(
            player,
            score,
            currLeaderboard
        );

        await InteractionUtils.send(intr, scoreEmbed);
    }
}
