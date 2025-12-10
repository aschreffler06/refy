import { Message } from 'discord.js';
import { EventHandler, TriggerHandler } from './index.js';
export declare class MessageHandler implements EventHandler {
    private triggerHandler;
    constructor(triggerHandler: TriggerHandler);
    process(msg: Message): Promise<void>;
}
