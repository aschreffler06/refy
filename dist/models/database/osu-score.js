import { model, Schema } from 'mongoose';
const osuScoreSchema = new Schema({
    _id: { type: String, required: true },
    userId: { type: String, required: true },
    accuracy: { type: Number, required: true },
    count300: { type: Number, required: true },
    count100: { type: Number, required: true },
    count50: { type: Number, required: false },
    countMiss: { type: Number, required: true },
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
export { OsuScore, osuScoreSchema };
//# sourceMappingURL=osu-score.js.map