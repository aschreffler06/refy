import { ChatInputCommandInteraction, PermissionsString } from 'discord.js';
import { RateLimiter } from 'discord.js-rate-limiter';

import { Player } from '../../models/database/index.js';
import { Language } from '../../models/enum-helpers/index.js';
import { EventData } from '../../models/internal-models.js';
import { Lang } from '../../services/index.js';
import { InteractionUtils } from '../../utils/index.js';
import { Command, CommandDeferType } from '../index.js';

export class PpToggleSnipeNotifyCommand implements Command {
    public names = [Lang.getRef('chatCommands.ppToggleSnipeNotify', Language.Default)];
    public cooldown = new RateLimiter(1, 2000);
    public deferType = CommandDeferType.HIDDEN;
    public requireClientPerms: PermissionsString[] = [];

    public async execute(intr: ChatInputCommandInteraction, _data: EventData): Promise<void> {
        const player = await Player.findOne({ discord: intr.user.id }).exec();
        if (!player) {
            await InteractionUtils.send(intr, {
                content: 'You are not registered as a player. Use `/link` to register first.',
                ephemeral: true,
            });
            return;
        }

        player.notifyOnSnipe = !player.notifyOnSnipe;
        await player.save();

        await InteractionUtils.send(intr, {
            content: `Snipe notifications are now **${
                player.notifyOnSnipe ? 'enabled' : 'disabled'
            }**.`,
            ephemeral: true,
        });
    }
}
