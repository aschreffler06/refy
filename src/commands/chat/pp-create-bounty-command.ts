import { ChatInputCommandInteraction, PermissionsString } from 'discord.js';
import { RateLimiter } from 'discord.js-rate-limiter';

import { MatchStatus } from '../../enums/index.js';
import { PpMatch } from '../../models/database/index.js';
import { Language } from '../../models/enum-helpers/index.js';
import { EventData } from '../../models/internal-models.js';
import { Lang } from '../../services/index.js';
import { InteractionUtils } from '../../utils/index.js';
import { Command, CommandDeferType } from '../index.js';

export class PpCreateBountyCommand implements Command {
    public names = [Lang.getRef('chatCommands.ppCreateBounty', Language.Default)];
    public cooldown = new RateLimiter(1, 5000);
    public deferType = CommandDeferType.HIDDEN;
    public requireClientPerms: PermissionsString[] = [];

    public async execute(intr: ChatInputCommandInteraction, _data: EventData): Promise<void> {
        const args = {
            beatmapId: intr.options.getString(Lang.getRef('arguments.mapId', Language.Default)),
            winCondition: intr.options.getString(
                Lang.getRef('arguments.winCondition', Language.Default)
            ),
            value: intr.options.getNumber(Lang.getRef('arguments.value', Language.Default)),
            lowerRank: intr.options.getInteger(
                Lang.getRef('arguments.lowerRank', Language.Default)
            ),
            upperRank: intr.options.getInteger(
                Lang.getRef('arguments.upperRank', Language.Default)
            ),
            mod: intr.options.getString(Lang.getRef('arguments.mod', Language.Default)),
            mode: intr.options.getString(Lang.getRef('arguments.mode', Language.Default)),
        };
        const mod = args.mod ? args.mod : 'NM';
        const mode = args.mode ? args.mode : 'STD';

        const bounty = {
            _id: `${intr.guildId}-${Date.now()}`,
            beatmapId: args.beatmapId,
            winCondition: args.winCondition,
            value: args.value,
            lowerRank: args.lowerRank,
            upperRank: args.upperRank,
            mod: mod,
            mode: mode,
            isActive: true,
        };

        PpMatch.findOneAndUpdate(
            { guildId: intr.guildId, status: MatchStatus.ACTIVE },
            { $push: { bounties: bounty } }
        ).exec();

        await InteractionUtils.send(intr, `Bounty created: ${JSON.stringify(bounty)}`);
    }
}
