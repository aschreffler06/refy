import { REST } from '@discordjs/rest';
import { RESTPostAPIApplicationCommandsJSONBody } from 'discord.js';
export declare class CommandRegistrationService {
    private rest;
    constructor(rest: REST);
    process(localCmds: RESTPostAPIApplicationCommandsJSONBody[], args: string[]): Promise<void>;
    private formatCommandList;
}
