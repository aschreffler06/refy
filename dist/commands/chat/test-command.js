import { RateLimiter } from 'discord.js-rate-limiter';
// import { OsuMode } from '../../enums/index.js';
// import { OsuScore } from '../../models/database/index.js';
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
        const match = await PpMatch.findOne({ name: 'osu! Civil War' }).exec();
        // const osuService = new OsuService();
        // let scoreIdsToAdd = [];
        // let scores = [];
        // for (let i = 0; i < 10; i++) {
        //     const score = await osuService.getScore(scoreIdsToAdd[i]);
        //     scores.push(score);
        // }
        // // find the bounty that has the id of the scores
        // for (const bounty of match.bounties) {
        //     for (const score of scores) {
        //         if (bounty.beatmapId === score.beatmapId.toString()) {
        //             bounty.scores.push(score);
        //         }
        //     }
        // }
        // await match.save();
        const lbs = match.scoreLeaderboards;
        console.log(lbs);
        for (const lb of lbs) {
            for (const s of lb.scores) {
                if (s.beatmapId === '1256809')
                    console.log(s);
            }
        }
        await InteractionUtils.send(intr, Lang.getEmbed('displayEmbeds.test', data.lang));
    }
}
//# sourceMappingURL=test-command.js.map