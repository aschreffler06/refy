import { ChatInputCommandInteraction, PermissionsString } from 'discord.js';
import { EventData } from '../../models/internal-models.js';
import { Command, CommandDeferType } from '../index.js';
export declare class HelpCommand implements Command {
    names: string[];
    deferType: CommandDeferType;
    requireClientPerms: PermissionsString[];
    execute(intr: ChatInputCommandInteraction, data: EventData): Promise<void>;
}
