import { Client } from 'discord.js';
import { ButtonHandler, CommandHandler, GuildJoinHandler, GuildLeaveHandler, MessageHandler, ReactionHandler } from '../events/index.js';
import { JobService } from '../services/index.js';
export declare class Bot {
    private token;
    private client;
    private guildJoinHandler;
    private guildLeaveHandler;
    private messageHandler;
    private commandHandler;
    private buttonHandler;
    private reactionHandler;
    private jobService;
    private ready;
    constructor(token: string, client: Client, guildJoinHandler: GuildJoinHandler, guildLeaveHandler: GuildLeaveHandler, messageHandler: MessageHandler, commandHandler: CommandHandler, buttonHandler: ButtonHandler, reactionHandler: ReactionHandler, jobService: JobService);
    start(): Promise<void>;
    private registerListeners;
    private login;
    private onReady;
    private onShardReady;
    private onGuildJoin;
    private onGuildLeave;
    private onMessage;
    private onInteraction;
    private onReaction;
    private onRateLimit;
}
