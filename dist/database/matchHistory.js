import { model, Schema } from 'mongoose';
import { matchEventSchema } from './index.js';
const matchHistorySchema = new Schema({
    mpLink: { type: String, required: true },
    events: { type: [matchEventSchema], required: true },
    winner: { type: Schema.Types.ObjectId, default: null, required: true, ref: 'Team' },
});
const MatchHistory = model('MatchHistory', matchHistorySchema);
export { MatchHistory, matchHistorySchema };
//# sourceMappingURL=matchHistory.js.map