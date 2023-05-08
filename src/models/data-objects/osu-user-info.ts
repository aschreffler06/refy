/**
 * A class to hold information about a user.
 */

export class OsuUserInfo {
    id: number;
    username: string;
    rank: number;
    badges: number;
    accuracy: number;
    level: number;
    playCount: number;
    playTime: number;
    avatar: string;

    constructor(
        id: number = -1,
        username: string = '',
        rank: number = -1,
        badges: number = -1,
        accuracy: number = -1,
        level: number = -1,
        playCount: number = -1,
        playTime: number = -1,
        avatar: string = ''
    ) {
        this.id = id;
        this.username = username;
        this.rank = rank;
        this.badges = badges;
        this.accuracy = accuracy;
        this.level = level;
        this.playCount = playCount;
        this.playTime = playTime;
        this.avatar = avatar;
    }
}
