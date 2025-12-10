import { model, Schema } from 'mongoose';
import { Constants } from './constants.js';
const scoreSchema = new Schema({
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
export { Score, scoreSchema };
//# sourceMappingURL=score.js.map