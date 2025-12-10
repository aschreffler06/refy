import { Language } from '../models/enum-helpers/language.js';
import { EventData } from '../models/internal-models.js';
export class EventDataService {
    async create(options = {}) {
        // TODO: Retrieve any data you want to pass along in events
        // Event language
        let lang = options.guild?.preferredLocale &&
            Language.Enabled.includes(options.guild.preferredLocale)
            ? options.guild.preferredLocale
            : Language.Default;
        // Guild language
        let langGuild = options.guild?.preferredLocale &&
            Language.Enabled.includes(options.guild.preferredLocale)
            ? options.guild.preferredLocale
            : Language.Default;
        return new EventData(lang, langGuild);
    }
}
//# sourceMappingURL=event-data-service.js.map