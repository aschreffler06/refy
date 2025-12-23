import { ChatInputCommandInteraction, PermissionsString } from 'discord.js';
import { RateLimiter } from 'discord.js-rate-limiter';

import { PpMatch } from '../../models/database/pp-match.js';
import { Language } from '../../models/enum-helpers/index.js';
import { EventData } from '../../models/internal-models.js';
import { Lang } from '../../services/index.js';
import { InteractionUtils } from '../../utils/index.js';
import { Command, CommandDeferType } from '../index.js';

export class TestCommand implements Command {
    public names = [Lang.getRef('chatCommands.test', Language.Default)];
    public cooldown = new RateLimiter(1, 5000);
    public deferType = CommandDeferType.HIDDEN;
    public requireClientPerms: PermissionsString[] = [];

    public async execute(intr: ChatInputCommandInteraction, data: EventData): Promise<void> {
        const match = await PpMatch.findOne({ name: 'osu! Civil War' }).exec();
        for (const lb of match.scoreLeaderboards) {
            for (const score of lb.scores) {
                if (score.beatmapId === '370440') {
                    console.log(score);
                }
            }
        }
        // let mapsSeen = new Map<string, number>();
        // for (const lb of match.leaderboards) {
        //     for (const score of lb.scores) {
        //         if (mapsSeen.has(score.beatmapSetId)) {
        //             const existingPp = mapsSeen.get(score.beatmapSetId);
        //             if (score.pp > existingPp) {
        //                 // const currMap = mapsSeen.get(score.beatmapSetId);
        //                 // currMap.isActive = false;
        //                 mapsSeen.set(score.beatmapSetId, score.pp);
        //             }
        //         } else {
        //             mapsSeen.set(score.beatmapSetId, score.pp);
        //         }
        //     }
        // }
        // await match.save();
        await InteractionUtils.send(intr, Lang.getEmbed('displayEmbeds.test', data.lang));
    }
}
