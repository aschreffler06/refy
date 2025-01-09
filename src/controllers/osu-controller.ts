import axios from 'axios';
import { createRequire } from 'node:module';

import { GetUserParams } from '../enums/index.js';
import { OsuScoreDTO } from '../models/data-objects/osu-score-dto.js';
import { OsuUserInfoDTO } from '../models/data-objects/osu-user-info-dto.js';
import { Player, Token } from '../models/database/index.js';
// import { Request, Response, Router } from 'express';
// import router from 'express-promise-router';

// import { Controller } from './controller.js';
// import { GetAuthTokenResponse } from '../models/osu-api/index.js';
// import { GetOsuUserRequest } from '../models/osu-api/osu.js';

const require = createRequire(import.meta.url);
let Config = require('../../config/config.json');

// export class OsuController implements Controller {
export class OsuController {
    private osuEndpoint = 'https://osu.ppy.sh/api/v2';

    private async getAuthToken(forceNew: boolean = false): Promise<string> {
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
                    expirationTime:
                        Number(response.data.expires_in) + Math.trunc(Date.now() / 1000),
                });
                await Token.findOneAndUpdate({ _id: 1 }, newToken, { upsert: true }).exec();
                return newToken.token;
            } else {
                return token.token;
            }
        } catch (err) {
            console.log('Error getting access token');
        }
    }

    public async getUser({ id = null, username = null }: GetUserParams): Promise<OsuUserInfoDTO> {
        const token = await this.getAuthToken();
        const config = {
            headers: { Authorization: `Bearer ${token}` },
        };
        let user;
        try {
            if (id) {
                console.log('Getting user with id: ', id);
                user = await axios.get(`${this.osuEndpoint}/users/${id}/osu`, config);
            } else if (username) {
                console.log('Getting user: ', username);
                user = await axios.get(
                    `${this.osuEndpoint}/users/${username}/osu?key=username`,
                    config
                );
            } else {
                throw new Error('No id or username provided');
            }
            return new OsuUserInfoDTO(
                user.data.id,
                user.data.username,
                user.data.statistics.global_rank,
                user.data.badges.length,
                Math.round(user.data.statistics.hit_accuracy * 100) / 100,
                user.data.statistics.level.current,
                user.data.statistics.play_count,
                Math.round((user.data.statistics.play_time / 3600) * 100) / 100,
                user.data.avatar_url
            );
        } catch (err) {
            console.log('Error getting user');
        }
    }

    /**
     * Does not include fails
     * @param discordId
     * @param mode
     * @returns
     */
    public async getRecentPlays(discordId: string, mode?: string): Promise<OsuScoreDTO[]> {
        if (!mode) {
            mode = 'osu';
        }
        const token = await this.getAuthToken();
        const config = {
            headers: { Authorization: `Bearer ${token}` },
        };
        const osu = await Player.findOne({ discord: discordId }).exec();
        const osuId = osu._id;
        const recentPlays = await axios.get(
            `${this.osuEndpoint}/users/${osuId}/scores/recent?limit=25&mode=${mode}`,
            config
        );
        const scores: OsuScoreDTO[] = [];
        for (const play of recentPlays.data) {
            scores.push(
                new OsuScoreDTO(
                    play.id,
                    play.user.id,
                    play.accuracy,
                    play.statistics.count_300,
                    play.statistics.count_100,
                    play.statistics.count_50,
                    play.statistics.count_miss,
                    play.max_combo,
                    await this.getBeatmapCombo(play.beatmap.id),
                    await this.getBeatmapModdedDifficulty(play.beatmap.id, play.mods),
                    play.pp,
                    play.rank,
                    play.score,
                    play.mods,
                    Math.trunc(new Date(play.created_at).getTime() / 1000),
                    play.mode,
                    play.passed,
                    play.beatmap.id,
                    play.beatmap.status,
                    play.beatmapset.title,
                    play.beatmap.version,
                    play.beatmap.url,
                    play.beatmapset.covers.list
                )
            );
        }
        return scores;
    }

    public async getBeatmapCombo(beatmapId: string): Promise<number> {
        const token = await this.getAuthToken();
        const config = {
            headers: { Authorization: `Bearer ${token}` },
        };
        const beatmap = await axios.get(
            `${this.osuEndpoint}/beatmaps/lookup?id=${beatmapId}`,
            config
        );
        return beatmap.data.max_combo;
    }

    public async getBeatmapDifficulty(beatmapId: string): Promise<number> {
        const token = await this.getAuthToken();
        const config = {
            headers: { Authorization: `Bearer ${token}` },
        };
        const beatmap = await axios.get(
            `${this.osuEndpoint}/beatmaps/lookup?id=${beatmapId}`,
            config
        );
        return beatmap.data.difficulty_rating;
    }

    public async getBeatmapModdedDifficulty(beatmapId: string, mods: string[]): Promise<number> {
        const token = await this.getAuthToken();
        const config = {
            headers: { Authorization: `Bearer ${token}` },
        };
        const beatmap = await axios.post(
            `${this.osuEndpoint}/beatmaps/${beatmapId}/attributes`,
            { mods: mods },
            config
        );
        return beatmap.data.attributes.star_rating;
    }
}
