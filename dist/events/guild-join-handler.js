import { createRequire } from 'node:module';
import { Language } from '../models/enum-helpers/index.js';
import { Lang, Logger } from '../services/index.js';
import { ClientUtils, FormatUtils, MessageUtils } from '../utils/index.js';
const require = createRequire(import.meta.url);
let Logs = require('../../lang/logs.json');
export class GuildJoinHandler {
    constructor(eventDataService) {
        this.eventDataService = eventDataService;
    }
    async process(guild) {
        Logger.info(Logs.info.guildJoined
            .replaceAll('{GUILD_NAME}', guild.name)
            .replaceAll('{GUILD_ID}', guild.id));
        let owner = await guild.fetchOwner();
        // Get data from database
        let data = await this.eventDataService.create({
            user: owner?.user,
            guild,
        });
        // Send welcome message to the server's notify channel
        let notifyChannel = await ClientUtils.findNotifyChannel(guild, data.langGuild);
        if (notifyChannel) {
            await MessageUtils.send(notifyChannel, Lang.getEmbed('displayEmbeds.welcome', data.langGuild, {
                CMD_LINK_HELP: FormatUtils.commandMention(await ClientUtils.findAppCommand(guild.client, Lang.getRef('chatCommands.help', Language.Default))),
            }).setAuthor({
                name: guild.name,
                iconURL: guild.iconURL(),
            }));
        }
        // Send welcome message to owner
        if (owner) {
            await MessageUtils.send(owner.user, Lang.getEmbed('displayEmbeds.welcome', data.lang, {
                CMD_LINK_HELP: FormatUtils.commandMention(await ClientUtils.findAppCommand(guild.client, Lang.getRef('chatCommands.help', Language.Default))),
            }).setAuthor({
                name: guild.name,
                iconURL: guild.iconURL(),
            }));
        }
    }
}
//# sourceMappingURL=guild-join-handler.js.map