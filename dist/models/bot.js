import { AutocompleteInteraction, ButtonInteraction, CommandInteraction, Events, RESTEvents, } from 'discord.js';
import { createRequire } from 'node:module';
import { Logger } from '../services/index.js';
import { PartialUtils } from '../utils/index.js';
const require = createRequire(import.meta.url);
let Config = require('../../config/config.json');
let Debug = require('../../config/debug.json');
let Logs = require('../../lang/logs.json');
export class Bot {
    constructor(token, client, guildJoinHandler, guildLeaveHandler, messageHandler, commandHandler, buttonHandler, reactionHandler, jobService) {
        this.token = token;
        this.client = client;
        this.guildJoinHandler = guildJoinHandler;
        this.guildLeaveHandler = guildLeaveHandler;
        this.messageHandler = messageHandler;
        this.commandHandler = commandHandler;
        this.buttonHandler = buttonHandler;
        this.reactionHandler = reactionHandler;
        this.jobService = jobService;
        this.ready = false;
    }
    async start() {
        this.registerListeners();
        await this.login(this.token);
    }
    registerListeners() {
        this.client.on(Events.ClientReady, () => this.onReady());
        this.client.on(Events.ShardReady, (shardId, unavailableGuilds) => this.onShardReady(shardId, unavailableGuilds));
        this.client.on(Events.GuildCreate, (guild) => this.onGuildJoin(guild));
        this.client.on(Events.GuildDelete, (guild) => this.onGuildLeave(guild));
        this.client.on(Events.MessageCreate, (msg) => this.onMessage(msg));
        this.client.on(Events.InteractionCreate, (intr) => this.onInteraction(intr));
        this.client.on(Events.MessageReactionAdd, (messageReaction, user) => this.onReaction(messageReaction, user));
        this.client.rest.on(RESTEvents.RateLimited, (rateLimitData) => this.onRateLimit(rateLimitData));
    }
    async login(token) {
        try {
            await this.client.login(token);
        }
        catch (error) {
            Logger.error(Logs.error.clientLogin, error);
            return;
        }
    }
    async onReady() {
        let userTag = this.client.user?.tag;
        Logger.info(Logs.info.clientLogin.replaceAll('{USER_TAG}', userTag));
        if (!Debug.dummyMode.enabled) {
            this.jobService.start();
        }
        this.ready = true;
        Logger.info(Logs.info.clientReady);
    }
    onShardReady(shardId, _unavailableGuilds) {
        Logger.setShardId(shardId);
    }
    async onGuildJoin(guild) {
        if (!this.ready || Debug.dummyMode.enabled) {
            return;
        }
        try {
            await this.guildJoinHandler.process(guild);
        }
        catch (error) {
            Logger.error(Logs.error.guildJoin, error);
        }
    }
    async onGuildLeave(guild) {
        if (!this.ready || Debug.dummyMode.enabled) {
            return;
        }
        try {
            await this.guildLeaveHandler.process(guild);
        }
        catch (error) {
            Logger.error(Logs.error.guildLeave, error);
        }
    }
    async onMessage(msg) {
        if (!this.ready ||
            (Debug.dummyMode.enabled && !Debug.dummyMode.whitelist.includes(msg.author.id))) {
            return;
        }
        try {
            msg = await PartialUtils.fillMessage(msg);
            if (!msg) {
                return;
            }
            await this.messageHandler.process(msg);
        }
        catch (error) {
            Logger.error(Logs.error.message, error);
        }
    }
    async onInteraction(intr) {
        if (!this.ready ||
            (Debug.dummyMode.enabled && !Debug.dummyMode.whitelist.includes(intr.user.id))) {
            return;
        }
        if (intr instanceof CommandInteraction || intr instanceof AutocompleteInteraction) {
            try {
                await this.commandHandler.process(intr);
            }
            catch (error) {
                Logger.error(Logs.error.command, error);
            }
        }
        else if (intr instanceof ButtonInteraction) {
            try {
                await this.buttonHandler.process(intr);
            }
            catch (error) {
                Logger.error(Logs.error.button, error);
            }
        }
    }
    async onReaction(msgReaction, reactor) {
        if (!this.ready ||
            (Debug.dummyMode.enabled && !Debug.dummyMode.whitelist.includes(reactor.id))) {
            return;
        }
        try {
            msgReaction = await PartialUtils.fillReaction(msgReaction);
            if (!msgReaction) {
                return;
            }
            reactor = await PartialUtils.fillUser(reactor);
            if (!reactor) {
                return;
            }
            await this.reactionHandler.process(msgReaction, msgReaction.message, reactor);
        }
        catch (error) {
            Logger.error(Logs.error.reaction, error);
        }
    }
    async onRateLimit(rateLimitData) {
        if (rateLimitData.timeToReset >= Config.logging.rateLimit.minTimeout * 1000) {
            Logger.error(Logs.error.apiRateLimit, rateLimitData);
        }
    }
}
//# sourceMappingURL=bot.js.map