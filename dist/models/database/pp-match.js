import { model, Schema } from 'mongoose';
import { bountySchema } from './bounty.js';
import { osuScoreSchema, playerSchema } from './index.js';
import { MatchStatus, OsuMode } from '../../enums/index.js';
const ppTeamSchema = new Schema({
    name: { type: String, required: true },
    players: { type: [playerSchema], required: true },
});
const ppLeaderboardSchema = new Schema({
    lowerRank: { type: Number, required: true },
    upperRank: { type: Number, required: true },
    scores: { type: [osuScoreSchema], required: true },
    mode: { type: String, required: true, default: OsuMode.STANDARD },
});
const ppScoreLeaderboardSchema = new Schema({
    lowerRank: { type: Number, required: true },
    upperRank: { type: Number, required: true },
    scores: { type: [osuScoreSchema], required: true },
    mode: { type: String, required: true, default: OsuMode.STANDARD },
});
const ppMatchSchema = new Schema({
    name: { type: String, required: true },
    guildId: { type: String, required: true },
    teams: { type: [ppTeamSchema], required: true },
    leaderboards: { type: [ppLeaderboardSchema], required: true },
    scoreLeaderboards: {
        type: [ppScoreLeaderboardSchema],
        required: true,
    },
    // optional embedded bounties for the match
    bounties: { type: [bountySchema], required: false, default: [] },
    status: { type: String, enum: Object.values(MatchStatus), default: MatchStatus.ACTIVE },
    updatesChannelId: { type: String, required: false },
});
ppMatchSchema.method('addTeam', function addTeam(teamName) {
    this.teams.push({
        name: teamName,
        players: [],
    });
});
ppMatchSchema.method('addLeaderboard', function addLeaderboard(lowerRank, upperRank, mode = OsuMode.STANDARD) {
    this.leaderboards.push({
        lowerRank: lowerRank,
        upperRank: upperRank,
        scores: [],
        mode: mode,
    });
});
ppMatchSchema.method('addScoreLeaderboard', function addLeaderboard(lowerRank, upperRank) {
    this.scoreLeaderboards.push({
        lowerRank: lowerRank,
        upperRank: upperRank,
        scores: [],
        mode: OsuMode.STANDARD,
    });
});
const PpMatch = model('PpMatch', ppMatchSchema);
export { PpMatch };
//# sourceMappingURL=pp-match.js.map