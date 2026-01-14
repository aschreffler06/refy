/**
 * A class to hold information about a user.
 */
import { OsuMod, OsuMode, OsuRank } from '../../enums/index.js';
export declare class OsuScoreDTO {
    id: string;
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
    createdAt: number;
    mode: OsuMode;
    passed: boolean;
    beatmapSetId: string;
    beatmapId: string;
    status: string;
    title: string;
    version: string;
    url: string;
    list: string;
    constructor(id: string, userId: string, accuracy: number, number300s: number, number100s: number, number50s: number, numberMisses: number, countGeki: number, countKatu: number, maxCombo: number, beatmapMaxCombo: number, difficulty: number, pp: number, rank: OsuRank, score: number, mods: OsuMod[], createdAt: number, mode: OsuMode, passed: boolean, beatmapSetId: string, beatmapId: string, status: string, title: string, version: string, url: string, list: string);
}
