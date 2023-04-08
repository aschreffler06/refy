import { model, Schema, Types } from 'mongoose';

import { Constants } from './constants.js';

type IScore = {
    player: Types.ObjectId;
    score: number;
    mods: string[];
    maxCombo: number;
    accuracy: number;
    missCount: number;
};

const scoreSchema = new Schema<IScore>({
    player: { type: Schema.Types.ObjectId, required: true },
    score: { type: Number, required: true },
    mods: {
        type: [String],
        enum: Constants.MODS,
        required: true,
    },
    maxCombo: { type: Number, required: true },
    accuracy: { type: Number, required: true },
    missCount: { type: Number, required: true },
});

const Score = model('Score', scoreSchema);

export { Score, scoreSchema, IScore };
