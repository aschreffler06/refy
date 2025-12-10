import { RateLimiter } from 'discord.js-rate-limiter';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
let Config = require('../../config/config.json');
export class ReactionHandler {
    constructor(reactions, eventDataService) {
        this.reactions = reactions;
        this.eventDataService = eventDataService;
        this.rateLimiter = new RateLimiter(Config.rateLimiting.reactions.amount, Config.rateLimiting.reactions.interval * 1000);
    }
    async process(msgReaction, msg, reactor) {
        // Don't respond to self, or other bots
        if (reactor.id === msgReaction.client.user?.id || reactor.bot) {
            return;
        }
        // Check if user is rate limited
        let limited = this.rateLimiter.take(msg.author.id);
        if (limited) {
            return;
        }
        // Try to find the reaction the user wants
        let reaction = this.findReaction(msgReaction.emoji.name);
        if (!reaction) {
            return;
        }
        if (reaction.requireGuild && !msg.guild) {
            return;
        }
        if (reaction.requireSentByClient && msg.author.id !== msg.client.user?.id) {
            return;
        }
        // Check if the embeds author equals the reactors tag
        if (reaction.requireEmbedAuthorTag && msg.embeds[0]?.author?.name !== reactor.tag) {
            return;
        }
        // Get data from database
        let data = await this.eventDataService.create({
            user: reactor,
            channel: msg.channel,
            guild: msg.guild,
        });
        // Execute the reaction
        await reaction.execute(msgReaction, msg, reactor, data);
    }
    findReaction(emoji) {
        return this.reactions.find(reaction => reaction.emoji === emoji);
    }
}
//# sourceMappingURL=reaction-handler.js.map