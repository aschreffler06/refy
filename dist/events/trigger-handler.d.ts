import { Message } from 'discord.js';
import { EventDataService } from '../services/index.js';
import { Trigger } from '../triggers/index.js';
export declare class TriggerHandler {
    private triggers;
    private eventDataService;
    private rateLimiter;
    constructor(triggers: Trigger[], eventDataService: EventDataService);
    process(msg: Message): Promise<void>;
}
