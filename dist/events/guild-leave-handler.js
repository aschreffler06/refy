import { createRequire } from 'node:module';
import { Logger } from '../services/index.js';
const require = createRequire(import.meta.url);
let Logs = require('../../lang/logs.json');
export class GuildLeaveHandler {
    async process(guild) {
        Logger.info(Logs.info.guildLeft
            .replaceAll('{GUILD_NAME}', guild.name)
            .replaceAll('{GUILD_ID}', guild.id));
    }
}
//# sourceMappingURL=guild-leave-handler.js.map