import { AutocompleteInteraction, CommandInteraction } from 'discord.js';
import { Command } from '../commands/index.js';
import { EventDataService } from '../services/index.js';
import { EventHandler } from './index.js';
export declare class CommandHandler implements EventHandler {
    commands: Command[];
    private eventDataService;
    private rateLimiter;
    constructor(commands: Command[], eventDataService: EventDataService);
    process(intr: CommandInteraction | AutocompleteInteraction): Promise<void>;
    private sendError;
}
