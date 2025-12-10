import { MessageContextMenuCommandInteraction, PermissionsString } from 'discord.js';
import { RateLimiter } from 'discord.js-rate-limiter';
import { EventData } from '../../models/internal-models.js';
import { Command, CommandDeferType } from '../index.js';
export declare class ViewDateSent implements Command {
    names: string[];
    cooldown: RateLimiter;
    deferType: CommandDeferType;
    requireClientPerms: PermissionsString[];
    execute(intr: MessageContextMenuCommandInteraction, data: EventData): Promise<void>;
}
