import { ChatInputCommandInteraction, PermissionsString } from 'discord.js';
import { RateLimiter } from 'discord.js-rate-limiter';

import { Auction } from '../../database/index.js';
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
            option: intr.options.getString(Lang.getRef('arguments.name', Language.Default)),
        };

        const auction = await Auction.findOne({ name: args.option });
        if (auction === null) {
            await InteractionUtils.send(intr, `Auction ${args.option} does not exist`);
            return;
        }

        const bidders = auction.bidders.map(bidder => [bidder, '1500']);
        console.log(bidders);

        //setup message collector that gets messages from the bot. these messages are sent from the bid command and sale command. running timer etc. etc.

        await InteractionUtils.send(intr, args.option);
    }
}
