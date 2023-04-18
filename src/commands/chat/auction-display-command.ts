import { ChatInputCommandInteraction, PermissionsString } from 'discord.js';
import { RateLimiter } from 'discord.js-rate-limiter';

import { Auction } from '../../database/index.js';
import { Language } from '../../models/enum-helpers/index.js';
import { EventData } from '../../models/internal-models.js';
import { Lang } from '../../services/index.js';
import { InteractionUtils } from '../../utils/index.js';
import { Command, CommandDeferType } from '../index.js';

export class AuctionDisplayCommand implements Command {
    public names = [Lang.getRef('chatCommands.auctionDisplay', Language.Default)];
    public cooldown = new RateLimiter(1, 5000);
    public deferType = CommandDeferType.HIDDEN;
    public requireClientPerms: PermissionsString[] = [];

    public async execute(intr: ChatInputCommandInteraction, _data: EventData): Promise<void> {
        const guild_id = intr.guildId;
        const auctions = await Auction.find({ guild_id: guild_id });
        const auctionNames = auctions.map(auction => auction.name);
        await InteractionUtils.send(intr, `Auctions for this server: ${auctionNames}`);
    }
}
