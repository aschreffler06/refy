import { ChatInputCommandInteraction, PermissionsString } from 'discord.js';
import { RateLimiter } from 'discord.js-rate-limiter';

import { Player, PpMatch } from '../../models/database/index.js';
import { Language } from '../../models/enum-helpers/index.js';
import { EventData } from '../../models/internal-models.js';
import { Lang } from '../../services/index.js';
import { InteractionUtils } from '../../utils/index.js';
import { Command, CommandDeferType } from '../index.js';

export class PpJoinTeamCommand implements Command {
    public names = [Lang.getRef('chatCommands.ppJoinTeam', Language.Default)];
    public cooldown = new RateLimiter(1, 5000);
    public deferType = CommandDeferType.PUBLIC;
    public requireClientPerms: PermissionsString[] = [];

    public async execute(intr: ChatInputCommandInteraction, data: EventData): Promise<void> {
        const args = {
            teamName: intr.options.getString(Lang.getRef('arguments.name', data.lang)),
        };

        const match = await PpMatch.findOne({ guildId: intr.guildId }).exec();
        if (!match) {
            await InteractionUtils.send(intr, `No match is currently in progress for this server.`);
            return;
        }

        //TODO: make it so people can't join more than one team
        const player = await Player.findOne({ discord: intr.user.id }).exec();
        if (args.teamName === match.team1.name) {
            match.team1.players.push(player);
            await match.save();
        } else if (args.teamName === match.team2.name) {
            match.team2.players.push(player);
            await match.save();
        } else {
            await InteractionUtils.send(
                intr,
                `That team name is not in the match. Double check to make sure that you typed the name in correctly.`
            );
            return;
        }

        await InteractionUtils.send(intr, `Joined team **${args.teamName}**!`);
    }
}
