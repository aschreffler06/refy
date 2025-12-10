/**
 * A class to hold information about a user.
 */
export class OsuUserInfoDTO {
    constructor(id = -1, username = '', rank = -1, badges = -1, accuracy = -1, level = -1, playCount = -1, playTime = -1, avatar = '') {
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
//# sourceMappingURL=osu-user-info-dto.js.map