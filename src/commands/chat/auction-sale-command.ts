import { ChatInputCommandInteraction, EmbedBuilder, PermissionsString } from 'discord.js';
import { RateLimiter } from 'discord.js-rate-limiter';

import { OsuController } from '../../controllers/osu-controller.js';
import { Auction } from '../../models/database/auction.js';
import { Player } from '../../models/database/index.js';
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

        let auctioned = await Player.findOne({ username: args.name });
        if (!auctioned) {
            // await InteractionUtils.send(
            //     intr,
            //     `Now starting the bidding for ${args.name}! (no embed since they didn't link their account lol!)`
            // );
            const osuController = new OsuController();
            let userInfo = await osuController.getUser({ username: args.name });
            auctioned = new Player({
                _id: userInfo.id,
                username: userInfo.username,
                rank: userInfo.rank,
                accuracy: userInfo.accuracy,
                badges: userInfo.badges,
                level: userInfo.level,
                playCount: userInfo.playCount,
                playTime: userInfo.playTime,
                avatar: userInfo.avatar,
            });
        }
        const playerEmbed = new EmbedBuilder()
            .setTitle(`Now starting the bidding for ${args.name}!`)
            .setDescription(`Here's a quick overview of their profile.`)
            .addFields(
                { name: 'Rank', value: auctioned.rank.toString(), inline: true },
                { name: 'Accuracy', value: auctioned.accuracy.toString(), inline: true },
                { name: 'Badges', value: auctioned.badges.toString(), inline: true },
                { name: 'Level', value: auctioned.level.toString(), inline: true },
                { name: 'Play Count', value: auctioned.playCount.toString(), inline: true },
                { name: 'Play Time', value: auctioned.playTime.toString(), inline: true }
            )
            //TODO: add top 3 plays
            .setThumbnail(auctioned.avatar);

        await InteractionUtils.send(intr, playerEmbed);

        const bidCollector = intr.channel.createMessageCollector({ time: 15000 });

        let highestBidder = null;
        let highestBid = 0;

        bidCollector.on('collect', async m => {
            switch (true) {
                case /^bid [$]\d{1,3}$/.test(m.content): {
                    bidCollector.resetTimer({ time: 10000 });
                    const bid = parseInt(m.content.split('$')[1]);
                    if (!isBidValid(bid)) {
                        await InteractionUtils.send(
                            intr,
                            `<@${m.author.id}> Bid must be a multiple of $25 and between $25 and $600`
                        );
                        return;
                    }
                    if (bid > highestBid) {
                        highestBid = bid;
                        highestBidder = m.author.id;
                        await InteractionUtils.send(
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
                await InteractionUtils.send(intr, `No one bid on ${args.name}. Unlucky!`);
            } else {
                await InteractionUtils.send(
                    intr,
                    `Bidding ended! <@${highestBidder}> won with a bid of $${highestBid}!`
                );
                //TODO: for now we assume that only one auction is available per server
                const auction = await Auction.findOne({ guild_id: intr.guildId }).exec();
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
