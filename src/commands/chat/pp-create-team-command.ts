import { ChatInputCommandInteraction, PermissionsString } from 'discord.js';
import { RateLimiter } from 'discord.js-rate-limiter';

import { PpMatch } from '../../models/database/index.js';
import { Language } from '../../models/enum-helpers/index.js';
import { EventData } from '../../models/internal-models.js';
import { Lang } from '../../services/index.js';
import { InteractionUtils } from '../../utils/index.js';
import { Command, CommandDeferType } from '../index.js';

export class PpCreateTeamCommand implements Command {
    public names = [Lang.getRef('chatCommands.ppCreateTeam', Language.Default)];
    public cooldown = new RateLimiter(1, 5000);
    public deferType = CommandDeferType.HIDDEN;
    public requireClientPerms: PermissionsString[] = [];

    public async execute(intr: ChatInputCommandInteraction, data: EventData): Promise<void> {
        const args = {
            name: intr.options.getString(Lang.getRef('arguments.name', data.lang)),
        };
        //TODO: MAKE NOT NAME HARDCODED
        const match = await PpMatch.findOne({ name: 'AESA' }).exec();
        // const match = await PpMatch.findOne({ guildId: intr.guildId }).exec();
        if (!match) {
            await InteractionUtils.send(intr, `No match is currently in progress for this server.`);
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
