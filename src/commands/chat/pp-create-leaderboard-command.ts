import { ChatInputCommandInteraction, PermissionsString } from 'discord.js';
import { RateLimiter } from 'discord.js-rate-limiter';

import { MatchStatus, OsuMode } from '../../enums/index.js';
import { PpMatch } from '../../models/database/index.js';
import { Language } from '../../models/enum-helpers/index.js';
import { EventData } from '../../models/internal-models.js';
import { Lang } from '../../services/index.js';
import { InteractionUtils } from '../../utils/index.js';
import { Command, CommandDeferType } from '../index.js';

export class PpCreateLeaderboardCommand implements Command {
    public names = [Lang.getRef('chatCommands.ppCreateLeaderboard', Language.Default)];
    public cooldown = new RateLimiter(1, 5000);
    public deferType = CommandDeferType.HIDDEN;
    public requireClientPerms: PermissionsString[] = [];

    public async execute(intr: ChatInputCommandInteraction, data: EventData): Promise<void> {
        const args = {
            lowerRank: intr.options.getInteger(Lang.getRef('arguments.lowerRank', data.lang)),
            upperRank: intr.options.getInteger(Lang.getRef('arguments.upperRank', data.lang)),
            mode: intr.options.getString(Lang.getRef('arguments.mode', data.lang)),
        };

        const match = await PpMatch.findOne({
            guildId: intr.guildId,
            status: MatchStatus.ACTIVE,
        }).exec();
        if (!match) {
            await InteractionUtils.send(
                intr,
                `No active match is currently in progress for this server.`
            );
            return;
        }

        // Validate and convert mode string to OsuMode enum
        const mode = args.mode ? (args.mode as OsuMode) : OsuMode.STANDARD;

        //TODO: make it so ranges can't overlap
        match.addLeaderboard(args.lowerRank, args.upperRank, mode);

        await match.save();

        await InteractionUtils.send(intr, {
            content: `Added leaderboard for the rank range: ${args.lowerRank}-${args.upperRank}`,
            ephemeral: true,
        });
    }
}
