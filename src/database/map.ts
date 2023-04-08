import { model, Schema } from 'mongoose';

import { Constants } from './constants.js';

type IMap = {
    _id: number;
    mod: string[];
    slot: number;
    multiplier: number;
    comment: string;
};

const mapSchema = new Schema<IMap>({
    _id: { type: Number, required: true },
    mod: {
        type: [String],
        // TODO: Make these able to be appended to each other
        enum: Constants.TOURNEY_ROUNDS,
        required: true,
    },
    slot: { type: Number, required: true },
    multiplier: { type: Number, default: 1, required: true },
    comment: { type: String },
});

const Map = model('Map', mapSchema);

export { Map, mapSchema, IMap };
