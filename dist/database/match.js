import { model, Schema } from 'mongoose';
import { Constants } from './constants.js';
const matchSchema = new Schema({
    _id: { type: Number, required: true },
    team1: { type: Schema.Types.ObjectId, required: true, ref: 'Team' },
    team2: { type: Schema.Types.ObjectId, required: true, ref: 'Team' },
    // Store match date as number for simplification and use of epoch time
    time: { type: Number, required: true },
    // history: { type: matchHistorySchema, default: null, required: true },
    pool: { type: Schema.Types.ObjectId, required: true, ref: 'Pool' },
    state: {
        type: String,
        enum: Constants.MATCH_STATE,
        required: true,
    },
});
const Match = model('Match', matchSchema);
export { Match, matchSchema };
//# sourceMappingURL=match.js.map