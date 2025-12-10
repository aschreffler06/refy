/**
 * @description Setup command for auction. This command will create a new auction in the database.
 */
import { ChatInputCommandInteraction, PermissionsString } from 'discord.js';
import { RateLimiter } from 'discord.js-rate-limiter';
import { EventData } from '../../../models/internal-models.js';
import { Command, CommandDeferType } from '../../index.js';
export declare class AuctionSetupCommand implements Command {
    names: string[];
    cooldown: RateLimiter;
    deferType: CommandDeferType;
    requireClientPerms: PermissionsString[];
    execute(intr: ChatInputCommandInteraction, data: EventData): Promise<void>;
}
