import { GuildChannel, ThreadChannel, } from 'discord.js';
import { FormatUtils, InteractionUtils } from './index.js';
import { Permission } from '../models/enum-helpers/index.js';
import { Lang } from '../services/index.js';
export class CommandUtils {
    static findCommand(commands, commandParts) {
        let found = [...commands];
        let closestMatch;
        for (let [index, commandPart] of commandParts.entries()) {
            found = found.filter(command => command.names[index] === commandPart);
            if (found.length === 0) {
                return closestMatch;
            }
            if (found.length === 1) {
                return found[0];
            }
            let exactMatch = found.find(command => command.names.length === index + 1);
            if (exactMatch) {
                closestMatch = exactMatch;
            }
        }
        return closestMatch;
    }
    static async runChecks(command, intr, data) {
        if (command.cooldown) {
            let limited = command.cooldown.take(intr.user.id);
            if (limited) {
                await InteractionUtils.send(intr, Lang.getEmbed('validationEmbeds.cooldownHit', data.lang, {
                    AMOUNT: command.cooldown.amount.toLocaleString(data.lang),
                    INTERVAL: FormatUtils.duration(command.cooldown.interval, data.lang),
                }));
                return false;
            }
        }
        if ((intr.channel instanceof GuildChannel || intr.channel instanceof ThreadChannel) &&
            !intr.channel.permissionsFor(intr.client.user).has(command.requireClientPerms)) {
            await InteractionUtils.send(intr, Lang.getEmbed('validationEmbeds.missingClientPerms', data.lang, {
                PERMISSIONS: command.requireClientPerms
                    .map(perm => `**${Permission.Data[perm].displayName(data.lang)}**`)
                    .join(', '),
            }));
            return false;
        }
        return true;
    }
}
//# sourceMappingURL=command-utils.js.map