import { model, Schema, Types } from 'mongoose';

import { IMatchEvent, matchEventSchema } from './index.js';

type IMatchHistory = {
    mpLink: string;
    events: IMatchEvent[];
    winner: Types.ObjectId;
};

const matchHistorySchema = new Schema<IMatchHistory>({
    mpLink: { type: String, required: true },
    events: { type: [matchEventSchema], required: true },
    winner: { type: Schema.Types.ObjectId, default: null, required: true, ref: 'Team' },
});

const MatchHistory = model<IMatchHistory>('MatchHistory', matchHistorySchema);

export { MatchHistory, IMatchHistory, matchHistorySchema };
