import { EmbedBuilder } from 'discord.js';
import { OsuMode } from '../enums/index.js';
import { IOsuScore, IPlayer, IPpLeaderboard } from '../models/database/index.js';
export declare class PpLeaderboardUtils {
    /**
     * Function to create a consistent score embed
     * @param player
     * @param score
     * @returns
     */
    static createScoreEmbed(player: IPlayer, score: IOsuScore, leaderboard: IPpLeaderboard, oldPp?: number, newPp?: number): Promise<EmbedBuilder>;
    static getPlayerLeaderboard(player: IPlayer, leaderboards: IPpLeaderboard[], mode?: OsuMode): IPpLeaderboard;
    static getScoreOnLeaderboard(leaderboard: IPpLeaderboard, id: string): IOsuScore;
}
