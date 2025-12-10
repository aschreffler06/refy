/**
 * A class to hold information about a user.
 */
import { OsuMod, OsuMode, OsuRank } from '../../enums/index.js';
export declare class OsuScore {
    id: string;
    userId: string;
    pp: number;
    rank: OsuRank;
    mods: OsuMod[];
    created_at: number;
    mode: OsuMode;
    passed: boolean;
    title: string;
    version: string;
    url: string;
    list: string;
    constructor(id: string, userId: string, pp: number, rank: OsuRank, mods: OsuMod[], created_at: number, mode: OsuMode, passed: boolean, title: string, version: string, url: string, list: string);
}
