import { ChatInputCommandInteraction, PermissionsString } from 'discord.js';
import { RateLimiter } from 'discord.js-rate-limiter';
import { EventData } from '../../models/internal-models.js';
import { Command, CommandDeferType } from '../index.js';
/**
 * Puts an item up for sale. Countdown of 15 sec initially and resets to 10 every bid. 'bid $x' to bid.
 */
export declare class AuctionSaleCommand implements Command {
    names: string[];
    cooldown: RateLimiter;
    deferType: CommandDeferType;
    requireClientPerms: PermissionsString[];
    execute(intr: ChatInputCommandInteraction, _data: EventData): Promise<void>;
}
