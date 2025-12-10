import { RateLimiter } from 'discord.js-rate-limiter';
import { Auction } from '../../models/database/index.js';
import { Language } from '../../models/enum-helpers/index.js';
import { Lang } from '../../services/index.js';
import { InteractionUtils } from '../../utils/index.js';
import { CommandDeferType } from '../index.js';
export class AuctionDisplayCommand {
    constructor() {
        this.names = [Lang.getRef('chatCommands.auctionDisplay', Language.Default)];
        this.cooldown = new RateLimiter(1, 5000);
        this.deferType = CommandDeferType.HIDDEN;
        this.requireClientPerms = [];
    }
    async execute(intr, _data) {
        const guild_id = intr.guildId;
        const auctions = await Auction.find({ guild_id: guild_id });
        const auctionNames = auctions.map(auction => auction.name);
        await InteractionUtils.send(intr, `Auctions for this server: ${auctionNames}`);
    }
}
//# sourceMappingURL=auction-display-command.js.map