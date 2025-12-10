import { CommandInteraction, MessageComponentInteraction, ModalSubmitInteraction } from 'discord.js';
import { Command } from '../commands/index.js';
import { EventData } from '../models/internal-models.js';
export declare class CommandUtils {
    static findCommand(commands: Command[], commandParts: string[]): Command;
    static runChecks(command: Command, intr: CommandInteraction | MessageComponentInteraction | ModalSubmitInteraction, data: EventData): Promise<boolean>;
}
