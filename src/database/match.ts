import { model, Schema, Types } from 'mongoose';

import { Constants } from './constants.js';
import { IMatchHistory, matchHistorySchema } from './index.js';

type IMatch = {
    _id: number;
    team1: Types.ObjectId;
    team2: Types.ObjectId;
    time: number;
    history: IMatchHistory;
    pool: Types.ObjectId;
    state: string;
};

const matchSchema = new Schema<IMatch>({
    _id: { type: Number, required: true },
    team1: { type: Schema.Types.ObjectId, required: true, ref: 'Team' },
    team2: { type: Schema.Types.ObjectId, required: true, ref: 'Team' },
    // Store match date as number for simplification and use of epoch time
    time: { type: Number, required: true },
    history: { type: matchHistorySchema, default: null, required: true },
    pool: { type: Schema.Types.ObjectId, required: true, ref: 'Pool' },
    state: {
        type: String,
        enum: Constants.MATCH_STATE,
        required: true,
    },
});

const Match = model<IMatch>('Match', matchSchema);

export { Match, matchSchema, IMatch };
