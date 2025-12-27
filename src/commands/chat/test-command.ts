import { ChatInputCommandInteraction, PermissionsString } from 'discord.js';
import { RateLimiter } from 'discord.js-rate-limiter';

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
        // const match = await PpMatch.findOne({ name: 'osu! Civil War' }).exec();
        // const osuService = new OsuService();
        // const leaderboards = match.scoreLeaderboards;
        // for (const lb of leaderboards) {
        //     if (lb.lowerRank === 1) {
        //         const play = await osuService.getScore('5956532216');
        //         console.log
        //         const score = new OsuScore({
        //             _id: play.id,
        //             userId: 6404488,
        //             accuracy: play.accuracy,
        //             count300: play.count300,
        //             count100: play.count100,
        //             count50: play.count50,
        //             countMiss: play.countMiss,
        //             maxCombo: play.maxCombo,
        //             beatmapMaxCombo: play.beatmapMaxCombo,
        //             difficulty: play.difficulty,
        //             pp: play.pp,
        //             rank: play.rank,
        //             score: play.score,
        //             mods: play.mods,
        //             created_at: play.createdAt,
        //             mode: play.mode,
        //             passed: play.passed,
        //             beatmapId: play.beatmapId,
        //             beatmapSetId: play.beatmapSetId,
        //             status: play.status,
        //             title: play.title,
        //             version: play.version,
        //             url: play.url,
        //             list: play.list,
        //             teamName: 'South',
        //         });
        //         lb.scores.push(score);
        //         await match.save();
        //     }
        // }
        await InteractionUtils.send(intr, Lang.getEmbed('displayEmbeds.test', data.lang));
    }
}
