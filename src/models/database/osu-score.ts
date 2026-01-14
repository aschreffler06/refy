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
    countGeki: number;
    countKatu: number;
    maxCombo: number;
    beatmapMaxCombo: number;
    difficulty: number;
    pp: number;
    rank: OsuRank;
    score: number;
    mods: OsuMod[];
    created_at: number;
    mode: OsuMode;
    passed: boolean;
    //TODO: break these down into beatmap/set
    beatmapSetId: string;
    beatmapId: string;
    status: string;
    title: string;
    version: string;
    url: string;
    list: string;
    teamName: string;
    isActive: boolean; // Whether this score counts toward leaderboard
}

const osuScoreSchema = new Schema<IOsuScore>({
    _id: { type: String, required: true },
    userId: { type: String, required: true },
    accuracy: { type: Number, required: true },
    count300: { type: Number, required: true },
    count100: { type: Number, required: true },
    count50: { type: Number, required: false },
    countMiss: { type: Number, required: true },
    countGeki: { type: Number, required: false },
    countKatu: { type: Number, required: false },
    maxCombo: { type: Number, required: true },
    beatmapMaxCombo: { type: Number, required: true },
    difficulty: { type: Number, required: true },
    pp: { type: Number, required: false },
    rank: { type: String, required: true },
    score: { type: Number, required: true },
    mods: { type: [String], required: true },
    created_at: { type: Number, required: true },
    mode: { type: String, required: true },
    passed: { type: Boolean, required: true },
    beatmapSetId: { type: String, required: true },
    beatmapId: { type: String, required: true },
    status: { type: String, required: true },
    title: { type: String, required: true },
    version: { type: String, required: true },
    url: { type: String, required: true },
    list: { type: String, required: true },
    teamName: { type: String, required: false },
    isActive: { type: Boolean, required: true, default: true },
});

const OsuScore = model('OsuScore', osuScoreSchema);

export { OsuScore, IOsuScore, osuScoreSchema };
