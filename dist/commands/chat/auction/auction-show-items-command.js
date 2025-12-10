import { EmbedBuilder } from 'discord.js';
import { RateLimiter } from 'discord.js-rate-limiter';
import { Auction } from '../../../models/database/index.js';
import { Language } from '../../../models/enum-helpers/index.js';
import { Lang } from '../../../services/index.js';
import { InteractionUtils } from '../../../utils/index.js';
import { CommandDeferType } from '../../index.js';
export class AuctionShowItemsCommand {
    constructor() {
        this.names = [Lang.getRef('chatCommands.auctionShowItems', Language.Default)];
        this.cooldown = new RateLimiter(1, 5000);
        this.deferType = CommandDeferType.PUBLIC;
        this.requireClientPerms = [];
    }
    async execute(intr, _data) {
        const auction = await Auction.findOne({ guild_id: intr.guildId }).exec();
        const items = auction.getItems(intr.user.id);
        if (items.length === 0) {
            await InteractionUtils.send(intr, `no friends lol`);
            return;
        }
        const itemsString = items.join('\n');
        const itemEmbed = new EmbedBuilder()
            .setTitle(`Viewing ${intr.user.username}'s team`)
            .addFields({ name: 'Team Members', value: itemsString });
        await InteractionUtils.send(intr, itemEmbed);
    }
}
//# sourceMappingURL=auction-show-items-command.js.map