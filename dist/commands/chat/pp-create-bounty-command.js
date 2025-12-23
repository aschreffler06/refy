import { RateLimiter } from 'discord.js-rate-limiter';
import { MatchStatus, OsuMod, OsuMode } from '../../enums/index.js';
import { PpMatch } from '../../models/database/index.js';
import { Language } from '../../models/enum-helpers/index.js';
import { Lang } from '../../services/index.js';
import { InteractionUtils } from '../../utils/index.js';
import { CommandDeferType } from '../index.js';
export class PpCreateBountyCommand {
    constructor() {
        this.names = [Lang.getRef('chatCommands.ppCreateBounty', Language.Default)];
        this.cooldown = new RateLimiter(1, 5000);
        this.deferType = CommandDeferType.HIDDEN;
        this.requireClientPerms = [];
    }
    async execute(intr, _data) {
        const args = {
            beatmapId: intr.options.getString(Lang.getRef('arguments.mapId', Language.Default)),
            winCondition: intr.options.getString(Lang.getRef('arguments.winCondition', Language.Default)),
            value: intr.options.getNumber(Lang.getRef('arguments.value', Language.Default)),
            lowerRank: intr.options.getInteger(Lang.getRef('arguments.lowerRank', Language.Default)),
            upperRank: intr.options.getInteger(Lang.getRef('arguments.upperRank', Language.Default)),
            mod: intr.options.getString(Lang.getRef('arguments.mod', Language.Default)),
            mode: intr.options.getString(Lang.getRef('arguments.mode', Language.Default)),
            startTime: intr.options.getString(Lang.getRef('arguments.startTime', Language.Default)),
            endTime: intr.options.getString(Lang.getRef('arguments.endTime', Language.Default)),
        };
        const mod = args.mod ? args.mod : OsuMod.NM;
        const mode = args.mode ? args.mode : OsuMode.STANDARD;
        // Convert MM/DD/YYYY HH:mm format to epoch seconds in UTC
        const parseDateTime = (dateStr) => {
            const [datePart, timePart] = dateStr.split(' ');
            const [month, day, year] = datePart.split('/').map(Number);
            const [hours, minutes] = timePart.split(':').map(Number);
            return Math.floor(Date.UTC(year, month - 1, day, hours, minutes) / 1000);
        };
        const startTime = parseDateTime(args.startTime);
        const endTime = parseDateTime(args.endTime);
        const bounty = {
            _id: `${intr.guildId}-${Date.now()}`,
            beatmapId: args.beatmapId,
            winCondition: args.winCondition,
            value: args.value,
            lowerRank: args.lowerRank,
            upperRank: args.upperRank,
            startTime: startTime,
            endTime: endTime,
            mod: mod,
            mode: mode,
            isActive: true,
        };
        PpMatch.findOneAndUpdate({ guildId: intr.guildId, status: MatchStatus.ACTIVE }, { $push: { bounties: bounty } }).exec();
        await InteractionUtils.send(intr, `Bounty created: ${JSON.stringify(bounty)}`);
    }
}
//# sourceMappingURL=pp-create-bounty-command.js.map