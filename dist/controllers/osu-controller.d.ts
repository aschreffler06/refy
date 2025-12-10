import { GetUserParams } from '../enums/index.js';
import { OsuScoreDTO } from '../models/data-objects/osu-score-dto.js';
import { OsuUserInfoDTO } from '../models/data-objects/osu-user-info-dto.js';
export declare class OsuController {
    private osuEndpoint;
    private getAuthToken;
    getUser({ id, username }: GetUserParams): Promise<OsuUserInfoDTO>;
    /**
     * Does not include fails
     * @param discordId
     * @param mode
     * @returns
     */
    getRecentPlays(discordId: string, mode?: string): Promise<OsuScoreDTO[]>;
    getBeatmapCombo(beatmapId: string): Promise<number>;
    getBeatmapDifficulty(beatmapId: string): Promise<number>;
    getBeatmapModdedDifficulty(beatmapId: string, mods: string[]): Promise<number>;
}
