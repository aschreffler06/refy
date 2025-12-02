import { ChatInputCommandInteraction, PermissionsString } from 'discord.js';
import { RateLimiter } from 'discord.js-rate-limiter';

import { MatchStatus } from '../../enums/index.js';
import { Player, PpMatch } from '../../models/database/index.js';
import { Language } from '../../models/enum-helpers/index.js';
import { EventData } from '../../models/internal-models.js';
import { Lang } from '../../services/index.js';
import { InteractionUtils } from '../../utils/index.js';
import { Command, CommandDeferType } from '../index.js';

export class PpJoinTeamCommand implements Command {
    public names = [Lang.getRef('chatCommands.ppJoinTeam', Language.Default)];
    public cooldown = new RateLimiter(1, 5000);
    public deferType = CommandDeferType.HIDDEN;
    public requireClientPerms: PermissionsString[] = [];

    public async execute(intr: ChatInputCommandInteraction, data: EventData): Promise<void> {
        const args = {
            teamName: intr.options.getString(Lang.getRef('arguments.name', data.lang)),
        };

        const match = await PpMatch.findOne({ guildId: intr.guildId, status: MatchStatus.ACTIVE }).exec();
        if (!match) {
            await InteractionUtils.send(intr, `No active match is currently in progress for this server.`);
            return;
        }

        const player = await Player.findOne({ discord: intr.user.id }).exec();
        if (!player) {
            await InteractionUtils.send(
                intr,
                `You are not registered as a player. Please try running the /link command and try again.`
            );
            return;
        }
        for (const team of match.teams) {
            for (const player of team.players) {
                if (player.discord === intr.user.id) {
                    await InteractionUtils.send(
                        intr,
                        `You are already registered as a player in this match! Contact an admin if you need switched to a different team.`
                    );
                    return;
                }
            }
        }
        for (const team of match.teams) {
            if (team.name === args.teamName) {
                team.players.push(player);
                await match.save();
                await InteractionUtils.send(intr, {
                    content: `Joined team **${args.teamName}**!`,
                    ephemeral: true,
                });
                return;
            }
        }
        await InteractionUtils.send(
            intr,
            `Could not find a team with the name **${args.teamName}**. If you believe this is an error, contact an admin.`
        );
    }
}
