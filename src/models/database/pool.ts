import { model, Schema } from 'mongoose';

import { Constants } from './constants.js';
import { IMap, mapSchema } from './index.js';

type IPool = {
    maps: IMap[];
    numMaps: number;
    round: string;
    targetSr: number;
};

const poolSchema = new Schema<IPool>({
    maps: { type: [mapSchema], default: [], required: true },
    numMaps: { type: Number, required: true },
    round: {
        type: String,
        enum: Constants.TOURNEY_ROUNDS,
    },
    targetSr: { type: Number, required: true },
});

const Pool = model('Pool', poolSchema);

export { Pool, poolSchema, IPool };
