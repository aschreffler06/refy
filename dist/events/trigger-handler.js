import { RateLimiter } from 'discord.js-rate-limiter';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
let Config = require('../../config/config.json');
export class TriggerHandler {
    constructor(triggers, eventDataService) {
        this.triggers = triggers;
        this.eventDataService = eventDataService;
        this.rateLimiter = new RateLimiter(Config.rateLimiting.triggers.amount, Config.rateLimiting.triggers.interval * 1000);
    }
    async process(msg) {
        // Check if user is rate limited
        let limited = this.rateLimiter.take(msg.author.id);
        if (limited) {
            return;
        }
        // Find triggers caused by this message
        let triggers = this.triggers.filter(trigger => {
            if (trigger.requireGuild && !msg.guild) {
                return false;
            }
            if (!trigger.triggered(msg)) {
                return false;
            }
            return true;
        });
        // If this message causes no triggers then return
        if (triggers.length === 0) {
            return;
        }
        // Get data from database
        let data = await this.eventDataService.create({
            user: msg.author,
            channel: msg.channel,
            guild: msg.guild,
        });
        // Execute triggers
        for (let trigger of triggers) {
            await trigger.execute(msg, data);
        }
    }
}
//# sourceMappingURL=trigger-handler.js.map