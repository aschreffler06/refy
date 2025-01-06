import { ChatInputCommandInteraction, PermissionsString } from 'discord.js';
import { RateLimiter } from 'discord.js-rate-limiter';

import { PpMatch } from '../../models/database/index.js';
import { Language } from '../../models/enum-helpers/index.js';
import { EventData } from '../../models/internal-models.js';
import { Lang } from '../../services/index.js';
import { InteractionUtils } from '../../utils/index.js';
import { Command, CommandDeferType } from '../index.js';

export class PpCreateLeaderboardCommand implements Command {
    public names = [Lang.getRef('chatCommands.ppCreateLeaderboard', Language.Default)];
    public cooldown = new RateLimiter(1, 5000);
    public deferType = CommandDeferType.HIDDEN;
    public requireClientPerms: PermissionsString[] = [];

    public async execute(intr: ChatInputCommandInteraction, data: EventData): Promise<void> {
        //TODO: MAKE NOT NAME HARDCODED
        const match = await PpMatch.findOne({ name: 'AESA' }).exec();
        // const match = await PpMatch.findOne({ guildId: intr.guildId }).exec();
        if (!match) {
            await InteractionUtils.send(intr, `No match is currently in progress for this server.`);
            return;
        }

        const args = {
            lowerRank: intr.options.getInteger(Lang.getRef('arguments.lowerRank', data.lang)),
            upperRank: intr.options.getInteger(Lang.getRef('arguments.upperRank', data.lang)),
        };

        //TODO: make it so ranges can't overlap
        match.addLeaderboard(args.lowerRank, args.upperRank);

        await match.save();

        await InteractionUtils.send(intr, {
            content: `Added leaderboard for the rank range: ${args.lowerRank}-${args.upperRank}!`,
            ephemeral: true,
        });
    }
}
