/**
 * A class to hold information about a user.
 */
export class OsuScoreDTO {
    constructor(id, userId, accuracy, number300s, number100s, number50s, numberMisses, countGeki, countKatu, maxCombo, beatmapMaxCombo, difficulty, pp, rank, score, mods, createdAt, mode, passed, beatmapSetId, beatmapId, status, title, version, url, list) {
        this.id = id;
        this.userId = userId;
        this.accuracy = accuracy;
        this.count300 = number300s;
        this.count100 = number100s;
        this.count50 = number50s;
        this.countMiss = numberMisses;
        this.countGeki = countGeki;
        this.countKatu = countKatu;
        this.maxCombo = maxCombo;
        this.beatmapMaxCombo = beatmapMaxCombo;
        this.difficulty = difficulty;
        this.pp = pp;
        this.rank = rank;
        this.score = score;
        this.mods = mods;
        this.createdAt = createdAt;
        this.mode = mode;
        this.passed = passed;
        this.beatmapSetId = beatmapSetId;
        this.beatmapId = beatmapId;
        this.status = status;
        this.title = title;
        this.version = version;
        this.url = url;
        this.list = list;
    }
}
//# sourceMappingURL=osu-score-dto.js.map