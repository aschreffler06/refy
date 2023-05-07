/**
 * A class to hold information about a user.
 */

export class OsuUserInfo {
    id: number;
    username: string;
    rank: number;
    badges: number;

    constructor(id: number = -1, username: string = '', rank: number = -1, badges: number = -1) {
        this.id = id;
        this.username = username;
        this.rank = rank;
        this.badges = badges;
    }
}
