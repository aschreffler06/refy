import { model, Schema } from 'mongoose';
import { Constants } from './constants.js';
import { mapSchema } from './index.js';
const poolSchema = new Schema({
    maps: { type: [mapSchema], default: [], required: true },
    numMaps: { type: Number, required: true },
    round: {
        type: String,
        enum: Constants.TOURNEY_ROUNDS,
    },
    targetSr: { type: Number, required: true },
});
const Pool = model('Pool', poolSchema);
export { Pool, poolSchema };
//# sourceMappingURL=pool.js.map