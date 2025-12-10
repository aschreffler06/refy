import { model, Schema } from 'mongoose';
import { playerSchema } from './index.js';
const teamSchema = new Schema({
    name: { type: String, required: true },
    players: { type: [playerSchema], required: true },
    timezone: { type: String, required: true },
});
const Team = model('Team', teamSchema);
export { Team, teamSchema };
//# sourceMappingURL=team.js.map