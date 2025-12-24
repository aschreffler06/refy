import { RateLimiter } from 'discord.js-rate-limiter';
// import { OsuMode } from '../../enums/index.js';
// import { OsuScore } from '../../models/database/index.js';
import { OsuMode } from '../../enums/index.js';
import { PpMatch } from '../../models/database/pp-match.js';
import { Language } from '../../models/enum-helpers/index.js';
import { Lang } from '../../services/index.js';
import { InteractionUtils, ScoreManagementUtils } from '../../utils/index.js';
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
        const lbs = match.leaderboards;
        const userId = '21587761';
        // Find the source leaderboard (5000-999999)
        const sourceLb = lbs.find(lb => lb.mode === OsuMode.MANIA && lb.lowerRank === 5000 && lb.upperRank === 999999);
        // Find the target leaderboard (1000-4999)
        const targetLb = lbs.find(lb => lb.mode === OsuMode.MANIA && lb.lowerRank === 1000 && lb.upperRank === 4999);
        if (!sourceLb || !targetLb) {
            await InteractionUtils.send(intr, 'Leaderboards not found!');
            return;
        }
        // Find and collect scores to move
        const scoresToMove = sourceLb.scores.filter((s) => s.userId === userId);
        console.log(`Moving ${scoresToMove.length} scores from ${sourceLb.lowerRank}-${sourceLb.upperRank} to ${targetLb.lowerRank}-${targetLb.upperRank}`);
        // Remove scores from source leaderboard
        sourceLb.scores = sourceLb.scores.filter((s) => s.userId !== userId);
        // Add scores to target leaderboard using ScoreManagementUtils
        for (const score of scoresToMove) {
            ScoreManagementUtils.manageActiveScoresOnAdd(targetLb, score);
        }
        await match.save();
        await InteractionUtils.send(intr, `Moved ${scoresToMove.length} scores for user ${userId}`);
        await InteractionUtils.send(intr, Lang.getEmbed('displayEmbeds.test', data.lang));
    }
}
//# sourceMappingURL=test-command.js.map