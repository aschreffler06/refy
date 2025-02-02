/**
 * A class to hold information about a user.
 */

//TODO: figure out what to do with the dto and the model

import { OsuMod, OsuMode, OsuRank } from '../../enums/index.js';

export class OsuScoreDTO {
    id: string;
    userId: string;
    accuracy: number;
    count300: number;
    count100: number;
    count50: number;
    countMiss: number;
    maxCombo: number;
    beatmapMaxCombo: number;
    difficulty: number;
    pp: number;
    rank: OsuRank;
    score: number;
    mods: OsuMod[];
    createdAt: number;
    mode: OsuMode;
    passed: boolean;
    //TODO: break these down into beatmap/set
    beatmapId: string;
    status: string;
    title: string;
    version: string;
    url: string;
    list: string;

    constructor(
        id: string,
        userId: string,
        accuracy: number,
        number300s: number,
        number100s: number,
        number50s: number,
        numberMisses: number,
        maxCombo: number,
        beatmapMaxCombo: number,
        difficulty: number,
        pp: number,
        rank: OsuRank,
        score: number,
        mods: OsuMod[],
        createdAt: number,
        mode: OsuMode,
        passed: boolean,
        beatmapId: string,
        status: string,
        title: string,
        version: string,
        url: string,
        list: string
    ) {
        this.id = id;
        this.userId = userId;
        this.accuracy = accuracy;
        this.count300 = number300s;
        this.count100 = number100s;
        this.count50 = number50s;
        this.countMiss = numberMisses;
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
        this.beatmapId = beatmapId;
        this.status = status;
        this.title = title;
        this.version = version;
        this.url = url;
        this.list = list;
    }
}
