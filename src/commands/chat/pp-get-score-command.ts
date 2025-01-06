import { ChatInputCommandInteraction, PermissionsString } from 'discord.js';
import { RateLimiter } from 'discord.js-rate-limiter';

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
        };

        //TODO: MAKE NOT NAME HARDCODED
        const match = await PpMatch.findOne({ name: 'AESA' }).exec();
        // const match = await PpMatch.findOne({ guildId: intr.guildId }).exec();
        if (!match) {
            await InteractionUtils.send(intr, 'Match not found!');
            return;
        }

        const player = await Player.findOne({ discord: intr.user.id }).exec();
        const leaderboards = match.leaderboards;

        const currLeaderboard = PpLeaderboardUtils.getPlayerLeaderboard(player, leaderboards);
        const score = PpLeaderboardUtils.getMapOnLeaderbaord(currLeaderboard, args.id);
        if (!score) {
            await InteractionUtils.send(intr, 'Score not found!');
            return;
        }
        const scoreEmbed = PpLeaderboardUtils.createScoreEmbed(player, score);

        await InteractionUtils.send(intr, scoreEmbed);
    }
}
