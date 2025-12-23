import { GetUserParams, OsuMode } from '../enums/index.js';
import { OsuScoreDTO } from '../models/data-objects/osu-score-dto.js';
import { OsuUserInfoDTO } from '../models/data-objects/osu-user-info-dto.js';
export declare class OsuService {
    private osuEndpoint;
    private getAuthToken;
    getUser({ id, username, mode, }: GetUserParams): Promise<OsuUserInfoDTO>;
    getUserAllModes({ id, username, }: GetUserParams): Promise<{
        osu: number;
        taiko: number;
        fruits: number;
        mania: number;
    }>;
    /**
     * Does not include fails
     * @param discordId
     * @param mode
     * @returns
     */
    getRecentPlays(discordId: string, mode?: OsuMode | string): Promise<OsuScoreDTO[]>;
    getBeatmapCombo(beatmapId: string): Promise<number>;
    getBeatmapDifficulty(beatmapId: string): Promise<number>;
    getBeatmapModdedDifficulty(beatmapId: string, mods: string[]): Promise<number>;
}
