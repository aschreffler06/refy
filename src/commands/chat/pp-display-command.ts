import { ChatInputCommandInteraction, PermissionsString } from 'discord.js';
import { RateLimiter } from 'discord.js-rate-limiter';

import { PpMatch } from '../../models/database/index.js';
import { Language } from '../../models/enum-helpers/index.js';
import { EventData } from '../../models/internal-models.js';
import { Lang } from '../../services/index.js';
import { InteractionUtils } from '../../utils/index.js';
import { Command, CommandDeferType } from '../index.js';

export class PpDisplayCommand implements Command {
    public names = [Lang.getRef('chatCommands.ppDisplay', Language.Default)];
    public cooldown = new RateLimiter(1, 5000);
    public deferType = CommandDeferType.PUBLIC;
    public requireClientPerms: PermissionsString[] = [];

    public async execute(intr: ChatInputCommandInteraction, _data: EventData): Promise<void> {
        const match = await PpMatch.findOne({ guildId: intr.guildId });
        //get the total pp for every score on each team

        const team1Scores = match.team1.scores.sort((a, b) => b.pp - a.pp);
        const team2Scores = match.team2.scores.sort((a, b) => b.pp - a.pp);

        //run pp formula for all scores (pp * .95 ^ (x-1)) x is 1 for top play, 2 for second, etc.
        let team1Pp = 0;
        let team2Pp = 0;
        for (let i = 0; i < team1Scores.length; i++) {
            team1Pp += team1Scores[i].pp * Math.pow(0.95, i);
        }
        for (let i = 0; i < team2Scores.length; i++) {
            team2Pp += team2Scores[i].pp * Math.pow(0.95, i);
        }

        //send the pp for each team
        await InteractionUtils.send(
            intr,
            `${match.team1.name} has **${team1Pp.toFixed(2)}** pp\n${
                match.team2.name
            } has **${team2Pp.toFixed(2)}** pp`
        );

        //add all the pp together for each team
    }
}
