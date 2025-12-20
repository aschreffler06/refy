import { model, Schema } from 'mongoose';

import { BountyWinCondition, OsuMod, OsuMode } from '../../enums/index.js';

interface IBounty {
    _id: string;
    isActive: boolean;
    winCondition: BountyWinCondition;
    value: number;
    beatmapId: string;
    lowerRank: number;
    upperRank: number;
    startTime: number;
    endTime: number;
    mod: OsuMod;
    mode: OsuMode;
    winningTeam: string | null;
}

const bountySchema = new Schema<IBounty>({
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

export { Bounty, IBounty, bountySchema };
