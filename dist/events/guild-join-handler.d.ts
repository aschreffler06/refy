import { Guild } from 'discord.js';
import { EventDataService } from '../services/index.js';
import { EventHandler } from './index.js';
export declare class GuildJoinHandler implements EventHandler {
    private eventDataService;
    constructor(eventDataService: EventDataService);
    process(guild: Guild): Promise<void>;
}
