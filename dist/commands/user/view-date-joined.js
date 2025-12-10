import { DMChannel } from 'discord.js';
import { RateLimiter } from 'discord.js-rate-limiter';
import { DateTime } from 'luxon';
import { Language } from '../../models/enum-helpers/index.js';
import { Lang } from '../../services/index.js';
import { InteractionUtils } from '../../utils/index.js';
import { CommandDeferType } from '../index.js';
export class ViewDateJoined {
    constructor() {
        this.names = [Lang.getRef('userCommands.viewDateJoined', Language.Default)];
        this.cooldown = new RateLimiter(1, 5000);
        this.deferType = CommandDeferType.PUBLIC;
        this.requireClientPerms = [];
    }
    async execute(intr, data) {
        let joinDate;
        if (!(intr.channel instanceof DMChannel)) {
            let member = await intr.guild.members.fetch(intr.targetUser.id);
            joinDate = member.joinedAt;
        }
        else
            joinDate = intr.targetUser.createdAt;
        await InteractionUtils.send(intr, Lang.getEmbed('displayEmbeds.viewDateJoined', data.lang, {
            TARGET: intr.targetUser.toString(),
            DATE: DateTime.fromJSDate(joinDate).toLocaleString(DateTime.DATE_HUGE),
        }));
    }
}
//# sourceMappingURL=view-date-joined.js.map