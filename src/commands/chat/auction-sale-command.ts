import { ChatInputCommandInteraction, EmbedBuilder, PermissionsString } from 'discord.js';
import { RateLimiter } from 'discord.js-rate-limiter';

import { Auction } from '../../models/database/auction.js';
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

        let auction = await Auction.findOne({ guild_id: intr.guildId }).exec();

        // let auctioned = await Player.findOne({ username: args.name });
        let auctioned = auction.players.find(player => player.name === args.name);
        if (!auctioned) {
            // await InteractionUtils.send(
            //     intr,
            //     `Now starting the bidding for ${args.name}! (no embed since they didn't link their account lol!)`
            // );
            // const osuController = new OsuController();
            // let userInfo = await osuController.getUser({ username: args.name });
            // auctioned = new Player({
            //     _id: userInfo.id,
            //     username: userInfo.username,
            //     rank: userInfo.rank,
            //     accuracy: userInfo.accuracy,
            //     badges: userInfo.badges,
            //     level: userInfo.level,
            //     playCount: userInfo.playCount,
            //     playTime: userInfo.playTime,
            //     avatar: userInfo.avatar,
            // });
        }
        const playerEmbed = new EmbedBuilder()
            .setTitle(`Now starting the bidding for ${args.name}!`)
            .addFields(
                { name: 'Seed', value: auctioned.seed.toString(), inline: true },
                { name: 'Rank', value: auctioned.rank.toLocaleString(), inline: true },
                { name: 'Current Bid', value: '$0', inline: true },
                {
                    name: 'Average Score',
                    value: auctioned.averageScore.toLocaleString(),
                    inline: true,
                },
                {
                    name: 'Best Map',
                    value: `${auctioned.bestMap.toLocaleString()} - ${auctioned.bestMapScore.toLocaleString()}`,
                    inline: true,
                },
                { name: 'Description', value: auctioned.description.toString() },
                { name: 'Ratings', value: `ETX: ${auctioned.etx} | SI: ${auctioned.skillIssue}` }
            )
            //TODO: add top 3 plays
            .setThumbnail(auctioned.avatar);

        const embed = await InteractionUtils.send(intr, playerEmbed);

        const bidCollector = intr.channel.createMessageCollector({ time: 30000 });

        let highestBidder = null;
        let highestBid = 0;

        bidCollector.on('collect', async m => {
            switch (true) {
                case /^bid [$]\d{1,2}(\.\d{1,2})?/.test(m.content): {
                    bidCollector.resetTimer({ time: 15000 });
                    const bid = parseFloat(m.content.split('$')[1]);
                    if (!isBidValid(bid)) {
                        await InteractionUtils.send(
                            intr,
                            `<@${m.author.id}> Bid must be a multiple of $50`
                        );
                        return;
                    }
                    let teamSize = auction.getItems(m.author.id).length;
                    let currCash = auction.getCash(m.author.id);
                    if (teamSize < 2 && currCash - bid < (2 - teamSize) * 50) {
                        await InteractionUtils.send(
                            intr,
                            `<@${m.author.id}> You cannot bid more than $${
                                currCash - (3 - teamSize) * 50
                            } to meet the required team size minimum`
                        );
                        return;
                    }
                    if (bid > highestBid) {
                        if (highestBidder == m.author.id) {
                            await InteractionUtils.send(
                                intr,
                                `<@${m.author.id}> You are already the highest bidder`
                            );
                            return;
                        }
                        if (currCash < bid) {
                            await InteractionUtils.send(intr, `<@${m.author.id}> You poor`);
                            return;
                        }
                        highestBid = bid;
                        highestBidder = m.author.id;
                        await InteractionUtils.send(
                            intr,
                            `<@${m.author.id}> is now the highest bidder with a bid of $${bid}`
                        );
                        embed.edit({
                            embeds: [
                                playerEmbed.setFields([
                                    {
                                        name: 'Seed',
                                        value: auctioned.seed.toString(),
                                        inline: true,
                                    },
                                    {
                                        name: 'Rank',
                                        value: auctioned.rank.toLocaleString(),
                                        inline: true,
                                    },
                                    {
                                        name: 'Current Bid',
                                        value: `<@${m.author.id}> - $` + highestBid.toFixed(0),
                                        inline: true,
                                    },
                                    {
                                        name: 'Average Score',
                                        value: auctioned.averageScore.toLocaleString(),
                                        inline: true,
                                    },
                                    {
                                        name: 'Best Map',
                                        value: `${auctioned.bestMap.toString()} - ${auctioned.bestMapScore.toLocaleString()}`,
                                        inline: true,
                                    },
                                    {
                                        name: 'Description',
                                        value: auctioned.description.toString(),
                                    },
                                ]),
                            ],
                        });
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
                    `Bidding ended! <@${highestBidder}> won with a bid of $${highestBid})}!`
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
    return bid % 50 === 0 && bid >= 50;
}
