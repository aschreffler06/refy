import { model, Schema } from 'mongoose';
import { playerSchema } from './index.js';
const leaderboardTeamSchema = new Schema({
    name: { type: String, required: true },
    players: { type: [playerSchema], required: true },
});
const leaderboardMatchSchema = new Schema({
    name: { type: String, required: true },
    guild_id: { type: String, required: true },
    team1: { type: leaderboardTeamSchema, required: true },
    team2: { type: leaderboardTeamSchema, required: true },
});
const LeaderboardMatch = model('LeaderboardMatch', leaderboardMatchSchema);
export { LeaderboardMatch };
//# sourceMappingURL=leaderboard-match.js.map