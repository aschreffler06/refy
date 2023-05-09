import { ChatInputCommandInteraction, EmbedBuilder, PermissionsString } from 'discord.js';
import { RateLimiter } from 'discord.js-rate-limiter';

import { Auction } from '../../models/database/index.js';
import { Language } from '../../models/enum-helpers/index.js';
import { EventData } from '../../models/internal-models.js';
import { Lang } from '../../services/index.js';
import { InteractionUtils } from '../../utils/interaction-utils.js';
import { Command, CommandDeferType } from '../index.js';

export class AuctionShowCashCommand implements Command {
    public names = [Lang.getRef('chatCommands.auctionShowCash', Language.Default)];
    public cooldown = new RateLimiter(1, 5000);
    public deferType = CommandDeferType.PUBLIC;
    public requireClientPerms: PermissionsString[] = [];

    public async execute(intr: ChatInputCommandInteraction, _data: EventData): Promise<void> {
        const auction = await Auction.findOne({ guild_id: intr.guildId }).exec();
        const cash = auction.getCash(intr.user.id);
        const cashEmbed = new EmbedBuilder()
            .setTitle(`Viewing ${intr.user.username}'s cash`)
            .addFields({ name: 'Cash', value: cash.toString() });

        await InteractionUtils.send(intr, cashEmbed);
    }
}
