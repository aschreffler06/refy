import { RateLimiter } from 'discord.js-rate-limiter';
import { Player } from '../../models/database/index.js';
import { Language } from '../../models/enum-helpers/index.js';
import { Lang } from '../../services/index.js';
import { InteractionUtils } from '../../utils/index.js';
import { CommandDeferType } from '../index.js';
export class PpToggleSnipeNotifyCommand {
    constructor() {
        this.names = [Lang.getRef('chatCommands.ppToggleSnipeNotify', Language.Default)];
        this.cooldown = new RateLimiter(1, 2000);
        this.deferType = CommandDeferType.HIDDEN;
        this.requireClientPerms = [];
    }
    async execute(intr, _data) {
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
            content: `Snipe notifications are now **${player.notifyOnSnipe ? 'enabled' : 'disabled'}**.`,
            ephemeral: true,
        });
    }
}
//# sourceMappingURL=pp-toggle-snipe-notify-command.js.map