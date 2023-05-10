/**
 * A class to hold information about a user.
 */

import { OsuMod, OsuMode, OsuRank } from '../../enums/index.js';

export class OsuScore {
    id: string;
    userId: string;
    pp: number;
    rank: OsuRank;
    mods: OsuMod[];
    created_at: number;
    mode: OsuMode;
    passed: boolean;
    //TODO: break these down into beatmap/set
    title: string;
    version: string;
    url: string;
    list: string;

    constructor(
        id: string,
        userId: string,
        pp: number,
        rank: OsuRank,
        mods: OsuMod[],
        created_at: number,
        mode: OsuMode,
        passed: boolean,
        title: string,
        version: string,
        url: string,
        list: string
    ) {
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
