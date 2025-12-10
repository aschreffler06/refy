/**
 * A class to hold information about a user.
 */
export declare class OsuUserInfoDTO {
    id: number;
    username: string;
    rank: number;
    badges: number;
    accuracy: number;
    level: number;
    playCount: number;
    playTime: number;
    avatar: string;
    constructor(id?: number, username?: string, rank?: number, badges?: number, accuracy?: number, level?: number, playCount?: number, playTime?: number, avatar?: string);
}
