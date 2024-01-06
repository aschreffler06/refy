import { ChatInputCommandInteraction, PermissionsString } from 'discord.js';
import { RateLimiter } from 'discord.js-rate-limiter';

import { PpMatch } from '../../models/database/pp-match.js';
import { Language } from '../../models/enum-helpers/index.js';
import { EventData } from '../../models/internal-models.js';
import { Lang } from '../../services/index.js';
import { InteractionUtils } from '../../utils/index.js';
import { Command, CommandDeferType } from '../index.js';

export class PpCreateMatchCommand implements Command {
    public names = [Lang.getRef('chatCommands.ppCreateMatch', Language.Default)];
    public cooldown = new RateLimiter(1, 5000);
    public deferType = CommandDeferType.HIDDEN;
    public requireClientPerms: PermissionsString[] = [];

    public async execute(intr: ChatInputCommandInteraction, data: EventData): Promise<void> {
        if ((await PpMatch.find({ guildId: intr.guildId }).count()) > 0) {
            await InteractionUtils.send(intr, `A match for this guild is already in progress!`);
            return;
        }

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
