import { Message, MessageReaction, User } from 'discord.js';
import { Reaction } from '../reactions/index.js';
import { EventDataService } from '../services/index.js';
import { EventHandler } from './index.js';
export declare class ReactionHandler implements EventHandler {
    private reactions;
    private eventDataService;
    private rateLimiter;
    constructor(reactions: Reaction[], eventDataService: EventDataService);
    process(msgReaction: MessageReaction, msg: Message, reactor: User): Promise<void>;
    private findReaction;
}
