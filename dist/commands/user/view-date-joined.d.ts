import { PermissionsString, UserContextMenuCommandInteraction } from 'discord.js';
import { RateLimiter } from 'discord.js-rate-limiter';
import { EventData } from '../../models/internal-models.js';
import { Command, CommandDeferType } from '../index.js';
export declare class ViewDateJoined implements Command {
    names: string[];
    cooldown: RateLimiter;
    deferType: CommandDeferType;
    requireClientPerms: PermissionsString[];
    execute(intr: UserContextMenuCommandInteraction, data: EventData): Promise<void>;
}
