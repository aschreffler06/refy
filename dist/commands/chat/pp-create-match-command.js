import { RateLimiter } from 'discord.js-rate-limiter';
import { PpMatch } from '../../models/database/pp-match.js';
import { Language } from '../../models/enum-helpers/index.js';
import { Lang } from '../../services/index.js';
import { InteractionUtils } from '../../utils/index.js';
import { CommandDeferType } from '../index.js';
export class PpCreateMatchCommand {
    constructor() {
        this.names = [Lang.getRef('chatCommands.ppCreateMatch', Language.Default)];
        this.cooldown = new RateLimiter(1, 5000);
        this.deferType = CommandDeferType.HIDDEN;
        this.requireClientPerms = [];
    }
    async execute(intr, data) {
        // if ((await PpMatch.find({ guildId: intr.guildId }).count()) > 0) {
        //     await InteractionUtils.send(intr, `A match for this guild is already in progress!`);
        //     console.log(await PpMatch.find({ guildId: intr.guildId }));
        //     return;
        // }
        const args = {
            name: intr.options.getString(Lang.getRef('arguments.name', data.lang)),
        };
        let match = new PpMatch({
            name: args.name,
            guildId: intr.guildId,
        });
        await match.save();
        await InteractionUtils.send(intr, {
            content: `Created match **${match.name}**!`,
            ephemeral: true,
        });
    }
}
//# sourceMappingURL=pp-create-match-command.js.map