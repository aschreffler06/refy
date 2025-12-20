import { model, Schema } from 'mongoose';
import { BountyWinCondition, OsuMod, OsuMode } from '../../enums/index.js';
const bountySchema = new Schema({
    _id: { type: String, required: true },
    isActive: { type: Boolean, required: true, default: true },
    winCondition: { type: String, required: true, enum: Object.values(BountyWinCondition) },
    value: { type: Number, required: true },
    beatmapId: { type: String, required: true },
    lowerRank: { type: Number, required: true },
    upperRank: { type: Number, required: true },
    startTime: { type: Number, required: true },
    endTime: { type: Number, required: true },
    mod: { type: String, required: true, enum: Object.values(OsuMod), default: OsuMod.NM },
    mode: { type: String, required: true, enum: Object.values(OsuMode), default: OsuMode.STANDARD },
    winningTeam: { type: String, required: false, default: null },
});
const Bounty = model('Bounty', bountySchema);
export { Bounty, bountySchema };
//# sourceMappingURL=bounty.js.map