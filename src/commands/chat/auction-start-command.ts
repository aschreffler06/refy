import { ChatInputCommandInteraction, EmbedBuilder, PermissionsString } from 'discord.js';
import { RateLimiter } from 'discord.js-rate-limiter';

import { Auction } from '../../models/database/index.js';
import { Language } from '../../models/enum-helpers/index.js';
import { EventData } from '../../models/internal-models.js';
import { Lang } from '../../services/index.js';
import { InteractionUtils } from '../../utils/index.js';
import { Command, CommandDeferType } from '../index.js';

export class AuctionStartCommand implements Command {
    public names = [Lang.getRef('chatCommands.auctionStart', Language.Default)];
    public cooldown = new RateLimiter(1, 5000);
    public deferType = CommandDeferType.PUBLIC;
    public requireClientPerms: PermissionsString[] = [];

    public async execute(intr: ChatInputCommandInteraction, _data: EventData): Promise<void> {
        const args = {
            name: intr.options.getString(Lang.getRef('arguments.name', Language.Default)),
        };

        const auction = await Auction.findOne({ name: args.name, guild_id: intr.guildId });
        if (auction === null) {
            await InteractionUtils.send(
                intr,
                `Auction ${args.name} does not exist for this server`
            );
            return;
        }

        const bidders = auction.bidders;
        // reset the auction in case it was ran before
        bidders.forEach(bidder => {
            bidder.cash = auction.starting_cash;
            bidder.items = [];
        });

        const auctionName = auction.name;

        let biddersString = '';
        for (const bidder of bidders) {
            biddersString += `<@${bidder._id}>\n`;
        }
        biddersString = biddersString.trim();

        const startEmbed = new EmbedBuilder()
            .setTitle(`Auction '${auctionName}' will begin shortly!`)
            .setDescription(
                `Bidding minimum is $25, maximum is $575, and you can only bid in values divisible by $25.\nYou will have 15 seconds for the first bid, and every bid will reset the timer to 10 seconds.\n To bid you need to type \`bid $<number>\``
            )
            .setColor(0xff0000)
            .setAuthor({
                name: Lang.getCom('bot.author'),
                iconURL: Lang.getCom('bot.icon'),
                url: Lang.getCom('bot.osu'),
            })
            .addFields(
                { name: 'Starting Cash', value: auction.starting_cash.toString() },
                { name: 'Bidders', value: biddersString }
            );

        InteractionUtils.send(intr, startEmbed);
    }
}
