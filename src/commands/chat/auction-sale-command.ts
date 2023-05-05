import { ChatInputCommandInteraction, PermissionsString } from 'discord.js';
import { RateLimiter } from 'discord.js-rate-limiter';

import { Auction } from '../../database/auction.js';
import { Language } from '../../models/enum-helpers/index.js';
import { EventData } from '../../models/internal-models.js';
import { Lang } from '../../services/index.js';
import { InteractionUtils } from '../../utils/index.js';
import { Command, CommandDeferType } from '../index.js';

/**
 * Puts an item up for sale. Countdown of 15 sec initially and resets to 10 every bid. 'bid $x' to bid.
 */

export class AuctionSaleCommand implements Command {
    public names = [Lang.getRef('chatCommands.auctionSale', Language.Default)];
    public cooldown = new RateLimiter(1, 5000);
    public deferType = CommandDeferType.PUBLIC;
    public requireClientPerms: PermissionsString[] = [];

    public async execute(intr: ChatInputCommandInteraction, _data: EventData): Promise<void> {
        const args = {
            name: intr.options.getString(Lang.getRef('arguments.name', Language.Default)),
        };
        InteractionUtils.send(intr, `Now starting the bidding for ${args.name}!`);
        //TODO: osu stuff here
        const bidCollector = intr.channel.createMessageCollector({ time: 15000 });

        let highestBidder = null;
        let highestBid = 0;

        bidCollector.on('collect', m => {
            switch (true) {
                case /^bid [$]\d{1,3}$/.test(m.content): {
                    console.log(`user ${m.author.tag} bid ${m.content.split('$')[1]}`);
                    bidCollector.resetTimer({ time: 10000 });
                    const bid = parseInt(m.content.split('$')[1]);
                    if (!isBidValid(bid)) {
                        InteractionUtils.send(
                            intr,
                            `<@${m.author.id}> Bid must be a multiple of $25 and between $25 and $600`
                        );
                        return;
                    }
                    if (bid > highestBid) {
                        highestBid = bid;
                        highestBidder = m.author.id;
                        InteractionUtils.send(
                            intr,
                            `<@${m.author.id}> is now the highest bidder with a bid of $${bid}`
                        );
                    }
                    break;
                }
                default:
                    break;
            }
        });
        bidCollector.on('end', async () => {
            if (highestBidder === null) {
                InteractionUtils.send(intr, `No one bid on ${args.name}! Unlucky`);
            } else {
                InteractionUtils.send(
                    intr,
                    `Bidding ended! <@${highestBidder}> won with a bid of $${highestBid}!`
                );
                //TODO: for now we assume that only one auction is available per server
                const auction = await Auction.findOne({ guild_id: intr.guildId });
                const bidders = auction.bidders;
                const winner = bidders.find(bidder => bidder._id === highestBidder);
                winner.cash -= highestBid;
                winner.items.push(args.name);
                await auction.save();
            }
        });
    }
}

function isBidValid(bid: number): boolean {
    return bid % 25 === 0 && bid >= 25 && bid <= 600;
}
