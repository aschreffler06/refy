import { ChatInputCommandInteraction, PermissionsString } from 'discord.js';
import { RateLimiter } from 'discord.js-rate-limiter';

import { MatchStatus } from '../../enums/match-status.js';
import { PpMatch } from '../../models/database/pp-match.js';
import { Language } from '../../models/enum-helpers/index.js';
import { EventData } from '../../models/internal-models.js';
import { Lang } from '../../services/index.js';
import { InteractionUtils } from '../../utils/index.js';
import { Command, CommandDeferType } from '../index.js';

export class PpSetUpdatesChannelCommand implements Command {
    public names = [Lang.getRef('chatCommands.ppSetUpdatesChannel', Language.Default)];
    public cooldown = new RateLimiter(1, 5000);
    public deferType = CommandDeferType.HIDDEN;
    public requireClientPerms: PermissionsString[] = [];

    public async execute(intr: ChatInputCommandInteraction, data: EventData): Promise<void> {
        const channel = intr.options.getChannel(Lang.getRef('arguments.channel', data.lang));

        if (!channel) {
            await InteractionUtils.send(intr, {
                content: 'Please provide a valid channel.',
                ephemeral: true,
            });
            return;
        }

        // Find active match for this guild
        const match = await PpMatch.findOne({
            guildId: intr.guildId,
            status: MatchStatus.ACTIVE,
        }).exec();
        if (!match) {
            await InteractionUtils.send(intr, {
                content: 'There is no active match for this server.',
                ephemeral: true,
            });
            return;
        }

        match.updatesChannelId = channel.id;
        await match.save();

        await InteractionUtils.send(intr, {
            content: `Set updates channel to <#${channel.id}> for match **${match.name}**.`,
            ephemeral: true,
        });
    }
}
