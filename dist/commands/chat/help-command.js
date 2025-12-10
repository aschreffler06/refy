import { HelpOption } from '../../enums/index.js';
import { Language } from '../../models/enum-helpers/index.js';
import { Lang } from '../../services/index.js';
import { ClientUtils, FormatUtils, InteractionUtils } from '../../utils/index.js';
import { CommandDeferType } from '../index.js';
export class HelpCommand {
    constructor() {
        this.names = [Lang.getRef('chatCommands.help', Language.Default)];
        this.deferType = CommandDeferType.PUBLIC;
        this.requireClientPerms = [];
    }
    async execute(intr, data) {
        let args = {
            option: intr.options.getString(Lang.getRef('arguments.option', Language.Default)),
        };
        let embed;
        switch (args.option) {
            case HelpOption.CONTACT_SUPPORT: {
                embed = Lang.getEmbed('displayEmbeds.helpContactSupport', data.lang);
                break;
            }
            case HelpOption.COMMANDS: {
                embed = Lang.getEmbed('displayEmbeds.helpCommands', data.lang, {
                    CMD_LINK_TEST: FormatUtils.commandMention(await ClientUtils.findAppCommand(intr.client, Lang.getRef('chatCommands.test', Language.Default))),
                    CMD_LINK_INFO: FormatUtils.commandMention(await ClientUtils.findAppCommand(intr.client, Lang.getRef('chatCommands.info', Language.Default))),
                });
                break;
            }
            default: {
                return;
            }
        }
        await InteractionUtils.send(intr, embed);
    }
}
//# sourceMappingURL=help-command.js.map