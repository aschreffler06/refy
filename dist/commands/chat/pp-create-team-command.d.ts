import { ChatInputCommandInteraction, PermissionsString } from 'discord.js';
import { RateLimiter } from 'discord.js-rate-limiter';
import { EventData } from '../../models/internal-models.js';
import { Command, CommandDeferType } from '../index.js';
export declare class PpCreateTeamCommand implements Command {
    names: string[];
    cooldown: RateLimiter;
    deferType: CommandDeferType;
    requireClientPerms: PermissionsString[];
    execute(intr: ChatInputCommandInteraction, data: EventData): Promise<void>;
}
