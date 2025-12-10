import { model, Schema } from 'mongoose';
import { Constants } from './constants.js';
import { scoreSchema } from './index.js';
const matchEventSchema = new Schema({
    eventType: {
        type: String,
        enum: Constants.EVENT_TYPE,
        required: true,
    },
    map: { type: String, required: true },
    choosingTeam: { type: Schema.Types.ObjectId, required: true, ref: 'Team' },
    winningTeam: { type: Schema.Types.ObjectId, required: true, ref: 'Team' },
    team1Scores: { type: [scoreSchema], default: [], required: true },
    team2Scores: { type: [scoreSchema], default: [], required: true },
});
const MatchEvent = model('MatchEvent', matchEventSchema);
export { MatchEvent, matchEventSchema };
//# sourceMappingURL=matchEvent.js.map