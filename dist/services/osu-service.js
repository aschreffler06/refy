import axios from 'axios';
import { createRequire } from 'node:module';
import { OsuMode } from '../enums/index.js';
import { OsuScoreDTO } from '../models/data-objects/osu-score-dto.js';
import { OsuUserInfoDTO } from '../models/data-objects/osu-user-info-dto.js';
import { Player, Token } from '../models/database/index.js';
const require = createRequire(import.meta.url);
let Config = require('../../config/config.json');
export class OsuService {
    constructor() {
        this.osuEndpoint = 'https://osu.ppy.sh/api/v2';
    }
    async getAuthToken(forceNew = false) {
        const bodyParameters = {
            client_id: Config.osu.id,
            client_secret: Config.osu.secret,
            grant_type: 'client_credentials',
            scope: 'public',
        };
        try {
            const token = await Token.findOne({ _id: 1 }).exec();
            if (token.isExpired() || !token || forceNew) {
                const response = await axios.post('https://osu.ppy.sh/oauth/token', bodyParameters);
                const newToken = new Token({
                    _id: 1,
                    token: response.data.access_token,
                    expirationTime: Number(response.data.expires_in) + Math.trunc(Date.now() / 1000),
                });
                await Token.findOneAndUpdate({ _id: 1 }, newToken, { upsert: true }).exec();
                return newToken.token;
            }
            else {
                return token.token;
            }
        }
        catch (err) {
            console.log('Error getting auth token:', err);
            throw new Error('Failed to get osu! API token');
        }
    }
    async getUser({ id = null, username = null, mode = null, }) {
        const token = await this.getAuthToken();
        if (!token) {
            throw new Error('Failed to authenticate with osu! API');
        }
        const config = {
            headers: { Authorization: `Bearer ${token}` },
        };
        let user;
        try {
            let url;
            if (id) {
                url = `${this.osuEndpoint}/users/${id}`;
            }
            else {
                url = `${this.osuEndpoint}/users/${username}`;
            }
            if (mode) {
                url += `/${mode}`;
            }
            user = await axios.get(url, config);
        }
        catch (err) {
            console.log('Error fetching user:', err);
            throw new Error(`Failed to fetch osu! user: ${username || id}`);
        }
        const data = user.data;
        return new OsuUserInfoDTO(data.id, data.username, data.statistics.global_rank, data.badges.length, data.statistics.hit_accuracy, data.statistics.level.current, data.statistics.play_count, data.statistics.play_time, data.avatar_url);
    }
    async getUserAllModes({ id = null, username = null, }) {
        const modes = ['osu', 'taiko', 'fruits', 'mania'];
        const ranks = {};
        for (const mode of modes) {
            try {
                const user = await this.getUser({ id, username, mode });
                ranks[mode] = user.rank;
            }
            catch (err) {
                console.log(`Error fetching rank for mode ${mode}:`, err);
                ranks[mode] = 0;
            }
        }
        return ranks;
    }
    /**
     * Does not include fails
     * @param discordId
     * @param mode
     * @returns
     */
    async getRecentPlays(discordId, mode) {
        if (!mode) {
            mode = OsuMode.STANDARD;
        }
        const token = await this.getAuthToken();
        if (!token) {
            throw new Error('Failed to authenticate with osu! API');
        }
        const config = {
            headers: { Authorization: `Bearer ${token}` },
        };
        const osu = await Player.findOne({ discord: discordId }).exec();
        if (!osu) {
            throw new Error('Player not found. Please link your osu! account first using /link command.');
        }
        const osuId = osu._id;
        let recentPlays;
        try {
            recentPlays = await axios.get(`${this.osuEndpoint}/users/${osuId}/scores/recent?limit=25&mode=${mode}`, config);
        }
        catch (err) {
            console.log('Error fetching recent plays:', err);
            throw new Error('Failed to fetch recent plays from osu! API');
        }
        const scores = [];
        for (const play of recentPlays.data) {
            scores.push(new OsuScoreDTO(play.id, play.user.id, play.accuracy, play.statistics.count_300, play.statistics.count_100, play.statistics.count_50, play.statistics.count_miss, play.max_combo, await this.getBeatmapCombo(play.beatmap.id), await this.getBeatmapModdedDifficulty(play.beatmap.id, play.mods), play.pp, play.rank, play.score, play.mods, Math.trunc(new Date(play.created_at).getTime() / 1000), play.mode, play.passed, play.beatmap.beatmapset_id, play.beatmap.id, play.beatmap.status, play.beatmapset.title, play.beatmap.version, play.beatmap.url, play.beatmapset.covers.list));
        }
        return scores;
    }
    async getBeatmapCombo(beatmapId) {
        const token = await this.getAuthToken();
        const config = {
            headers: { Authorization: `Bearer ${token}` },
        };
        try {
            const beatmap = await axios.get(`${this.osuEndpoint}/beatmaps/${beatmapId}`, config);
            return beatmap.data.max_combo;
        }
        catch (err) {
            console.log('Error fetching beatmap combo:', err);
            return 0; // Return 0 as fallback
        }
    }
    async getBeatmapDifficulty(beatmapId) {
        const token = await this.getAuthToken();
        const config = {
            headers: { Authorization: `Bearer ${token}` },
        };
        try {
            const beatmap = await axios.get(`${this.osuEndpoint}/beatmaps/${beatmapId}`, config);
            return beatmap.data.difficulty_rating;
        }
        catch (err) {
            console.log('Error fetching beatmap difficulty:', err);
            return 0; // Return 0 as fallback
        }
    }
    async getBeatmapModdedDifficulty(beatmapId, mods) {
        const token = await this.getAuthToken();
        const config = {
            headers: { Authorization: `Bearer ${token}` },
        };
        // Handle empty mods array - return normal difficulty
        if (!mods || mods.length === 0) {
            return await this.getBeatmapDifficulty(beatmapId);
        }
        try {
            // Use POST request with mods array in the request body
            const beatmap = await axios.post(`${this.osuEndpoint}/beatmaps/${beatmapId}/attributes`, {
                mods: mods,
            }, config);
            return beatmap.data.attributes.star_rating;
        }
        catch (err) {
            console.log('Error fetching beatmap modded difficulty:', err);
            return 0; // Return 0 as fallback
        }
    }
}
//# sourceMappingURL=osu-service.js.map