import { RateLimiter } from 'discord.js-rate-limiter';
import { MatchStatus } from '../../enums/index.js';
import { PpMatch } from '../../models/database/index.js';
import { Language } from '../../models/enum-helpers/index.js';
import { Lang } from '../../services/index.js';
import { InteractionUtils } from '../../utils/index.js';
import { CommandDeferType } from '../index.js';
export class PpCreateTeamCommand {
    constructor() {
        this.names = [Lang.getRef('chatCommands.ppCreateTeam', Language.Default)];
        this.cooldown = new RateLimiter(1, 5000);
        this.deferType = CommandDeferType.HIDDEN;
        this.requireClientPerms = [];
    }
    async execute(intr, data) {
        const args = {
            name: intr.options.getString(Lang.getRef('arguments.name', data.lang)),
        };
        const match = await PpMatch.findOne({
            guildId: intr.guildId,
            status: MatchStatus.ACTIVE,
        }).exec();
        if (!match) {
            await InteractionUtils.send(intr, `No active match is currently in progress for this server.`);
            return;
        }
        match.addTeam(args.name);
        await match.save();
        await InteractionUtils.send(intr, {
            content: `Added team **${args.name}**!`,
            ephemeral: true,
        });
    }
}
//# sourceMappingURL=pp-create-team-command.js.map