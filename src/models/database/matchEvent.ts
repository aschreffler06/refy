import { model, Schema, Types } from 'mongoose';

import { Constants } from './constants.js';
import { IScore, scoreSchema } from './index.js';

/**
 * MatchEvent covers picks, bans, protects, etc.
 * We will treat the properties of each event mutually exclusive from other event types.
 */
type IMatchEvent = {
    // for all
    eventType: string;
    map: string;
    choosingTeam: Types.ObjectId;

    // pick only
    winningTeam: Types.ObjectId;
    team1Scores: IScore[];
    team2Scores: IScore[];
};

const matchEventSchema = new Schema<IMatchEvent>({
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

export { MatchEvent, matchEventSchema, IMatchEvent };
