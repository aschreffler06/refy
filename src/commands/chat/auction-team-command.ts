import { ChatInputCommandInteraction, EmbedBuilder, PermissionsString } from 'discord.js';
import { RateLimiter } from 'discord.js-rate-limiter';

import { Auction } from '../../models/database/index.js';
import { Language } from '../../models/enum-helpers/index.js';
import { EventData } from '../../models/internal-models.js';
import { Lang } from '../../services/index.js';
import { InteractionUtils } from '../../utils/index.js';
import { Command, CommandDeferType } from '../index.js';

export class AuctionTeamCommand implements Command {
    public names = [Lang.getRef('chatCommands.auctionTeam', Language.Default)];
    public cooldown = new RateLimiter(1, 5000);
    public deferType = CommandDeferType.PUBLIC;
    public requireClientPerms: PermissionsString[] = [];

    public async execute(intr: ChatInputCommandInteraction, _data: EventData): Promise<void> {
        const auction = await Auction.findOne({ guild_id: intr.guildId }).exec();
        const items = auction.getItems(intr.user.id);
        if (items.length === 0) {
            await InteractionUtils.send(intr, `nothing`);
            return;
        }
        const itemsString = items.join('\n');

        const itemEmbed = new EmbedBuilder()
            .setTitle(`Viewing ${intr.user.username}'s team`)
            .addFields({ name: 'Team Members', value: itemsString });
        await InteractionUtils.send(intr, itemEmbed);
    }
}
