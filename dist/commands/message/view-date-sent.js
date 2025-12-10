import { RateLimiter } from 'discord.js-rate-limiter';
import { DateTime } from 'luxon';
import { Language } from '../../models/enum-helpers/index.js';
import { Lang } from '../../services/index.js';
import { InteractionUtils } from '../../utils/index.js';
import { CommandDeferType } from '../index.js';
export class ViewDateSent {
    constructor() {
        this.names = [Lang.getRef('messageCommands.viewDateSent', Language.Default)];
        this.cooldown = new RateLimiter(1, 5000);
        this.deferType = CommandDeferType.PUBLIC;
        this.requireClientPerms = [];
    }
    async execute(intr, data) {
        await InteractionUtils.send(intr, Lang.getEmbed('displayEmbeds.viewDateSent', data.lang, {
            DATE: DateTime.fromJSDate(intr.targetMessage.createdAt).toLocaleString(DateTime.DATE_HUGE),
        }));
    }
}
//# sourceMappingURL=view-date-sent.js.map