/**
 * A class to hold information about a user.
 */
export class OsuScore {
    constructor(id, userId, pp, rank, mods, created_at, mode, passed, title, version, url, list) {
        this.id = id;
        this.userId = userId;
        this.pp = pp;
        this.rank = rank;
        this.mods = mods;
        this.created_at = created_at;
        this.mode = mode;
        this.passed = passed;
        this.title = title;
        this.version = version;
        this.url = url;
        this.list = list;
    }
}
//# sourceMappingURL=osu-score.js.map