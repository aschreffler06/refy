import { model, Schema } from 'mongoose';

import { OsuMod, OsuMode, OsuRank } from '../../enums/index.js';

interface IOsuScore {
    _id: string;
    userId: string;
    accuracy: number;
    count300: number;
    count100: number;
    count50: number;
    countMiss: number;
    maxCombo: number;
    pp: number;
    rank: OsuRank;
    mods: OsuMod[];
    created_at: number;
    mode: OsuMode;
    passed: boolean;
    //TODO: break these down into beatmap/set
    beatmapId: string;
    status: string;
    title: string;
    version: string;
    url: string;
    list: string;
}

const osuScoreSchema = new Schema<IOsuScore>({
    _id: { type: String, required: true },
    userId: { type: String, required: true },
    accuracy: { type: Number, required: true },
    count300: { type: Number, required: true },
    count100: { type: Number, required: true },
    count50: { type: Number, required: true },
    countMiss: { type: Number, required: true },
    maxCombo: { type: Number, required: true },
    pp: { type: Number, required: true },
    rank: { type: String, required: true },
    mods: { type: [String], required: true },
    created_at: { type: Number, required: true },
    mode: { type: String, required: true },
    passed: { type: Boolean, required: true },
    beatmapId: { type: String, required: true },
    status: { type: String, required: true },
    title: { type: String, required: true },
    version: { type: String, required: true },
    url: { type: String, required: true },
    list: { type: String, required: true },
});

const OsuScore = model('OsuScore', osuScoreSchema);

export { OsuScore, IOsuScore, osuScoreSchema };
