import { RateLimiter } from 'discord.js-rate-limiter';
// import { OsuMode } from '../../enums/index.js';
import { PpMatch } from '../../models/database/pp-match.js';
import { Language } from '../../models/enum-helpers/index.js';
import { Lang } from '../../services/index.js';
import { InteractionUtils } from '../../utils/index.js';
import { CommandDeferType } from '../index.js';
export class TestCommand {
    constructor() {
        this.names = [Lang.getRef('chatCommands.test', Language.Default)];
        this.cooldown = new RateLimiter(1, 5000);
        this.deferType = CommandDeferType.HIDDEN;
        this.requireClientPerms = [];
    }
    async execute(intr, data) {
        const match = await PpMatch.findOne({ name: 'Test' }).exec();
        // const CWmatch = await PpMatch.findOne({ name: 'osu! Civil War' }).exec();
        // for (const lb of match.scoreLeaderboards) {
        //     for (const score of lb.scores) {
        //         if (score.beatmapId === '370440') {
        //             console.log(score);
        //         }
        //     }
        // }
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
        // const leaderboards = CWmatch.scoreLeaderboards;
        // for (const lb of leaderboards) {
        //     if (lb.scores.length === 0) {
        //         // delete the lbs
        //         CWmatch.scoreLeaderboards = CWmatch.scoreLeaderboards.filter(l => l !== lb);
        //     }
        // }
        // console.log(CWmatch.scoreLeaderboards);
        // CWmatch.save();
        // match.addScoreLeaderboard(1, 1000, OsuMode.STANDARD);
        // match.addScoreLeaderboard(1001, 10000, OsuMode.STANDARD);
        await match.save();
        await InteractionUtils.send(intr, Lang.getEmbed('displayEmbeds.test', data.lang));
    }
}
//# sourceMappingURL=test-command.js.map