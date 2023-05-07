import axios from 'axios';
import { createRequire } from 'node:module';

import { GetUserParams } from '../enums/index.js';
import { OsuUserInfo } from '../models/data-objects/osu-user-info.js';
import { Token } from '../models/database/index.js';
// import { Request, Response, Router } from 'express';
// import router from 'express-promise-router';

// import { Controller } from './controller.js';
// import { GetAuthTokenResponse } from '../models/osu-api/index.js';
// import { GetOsuUserRequest } from '../models/osu-api/osu.js';

const require = createRequire(import.meta.url);
let Config = require('../../config/config.json');

// export class OsuController implements Controller {
export class OsuController {
    // public path = '/osu';
    // public router: Router = router();
    // public authToken?: string;

    //TODO: ask scott if this needs changed to host this on a server
    private localApi = axios.create({
        baseURL: `http://localhost:${Config.api.port}`,
    });
    private osuEndpoint = 'https://osu.ppy.sh/api/v2';

    // public register(): void {
    //     this.router.get('/auth-token', (req, res) => this.getAuthToken(req, res));
    //     this.router.get('/user', (req, res) => this.getUser(req, res));
    // }

    private async getAuthToken(forceNew: boolean = false): Promise<string> {
        const bodyParameters = {
            client_id: Config.osu.id,
            client_secret: Config.osu.secret,
            grant_type: 'client_credentials',
            scope: 'public',
        };

        try {
            const token = await Token.findOne({ _id: 1 });
            if (token.isExpired() || !token || forceNew) {
                const response = await axios.post('https://osu.ppy.sh/oauth/token', bodyParameters);
                const newToken = new Token({
                    _id: 1,
                    token: response.data.access_token,
                    expirationTime:
                        Number(response.data.expires_in) + Math.trunc(Date.now() / 1000),
                });
                await Token.findOneAndUpdate({ _id: 1 }, newToken, { upsert: true });
                return newToken.token;
            } else {
                return token.token;
            }
        } catch (err) {
            console.log('Error getting access token');
        }
    }

    public async getUser({ id = null, username = null }: GetUserParams): Promise<OsuUserInfo> {
        const token = await this.getAuthToken();
        const config = {
            headers: { Authorization: `Bearer ${token}` },
        };
        let user;
        try {
            if (id) {
                user = await axios.get(`${this.osuEndpoint}/users/${id}/osu`, config);
            } else if (username) {
                user = await axios.get(
                    `${this.osuEndpoint}/users/${username}/osu?key=username`,
                    config
                );
            } else {
                throw new Error('No id or username provided');
            }
            return new OsuUserInfo(
                user.data.id,
                user.data.username,
                user.data.statistics.global_rank,
                user.data.badges.length
            );
        } catch (err) {
            console.log('Error getting user');
        }
    }

    // private async getAuthToken(req: Request, res: Response): Promise<void> {
    //     const bodyParameters = {
    //         client_id: Config.osu.id,
    //         client_secret: Config.osu.secret,
    //         grant_type: 'client_credentials',
    //         scope: 'public',
    //     };

    //     try {
    //         const token = await Token.findOne({ _id: 1 });
    //         let resBody: GetAuthTokenResponse;
    //         if (token.isExpired() || !token) {
    //             const response = await axios.post('https://osu.ppy.sh/oauth/token', bodyParameters);
    //             resBody = {
    //                 token: response.data.access_token,
    //                 expirationTime:
    //                     Number(response.data.expires_in) + Math.trunc(Date.now() / 1000),
    //             };
    //             const newToken = new Token({
    //                 _id: 1,
    //                 token: resBody.token,
    //                 expirationTime: resBody.expirationTime,
    //             });
    //             await newToken.save();
    //             res.status(200).json(resBody);
    //         } else {
    //             resBody = {
    //                 token: token.token,
    //                 expirationTime: token.expirationTime,
    //             };
    //             res.status(200).json(resBody);
    //         }
    //     } catch (err) {
    //         //TODO: maybe get better error handling/message/custom error here?
    //         res.status(500).send('Error getting access token');
    //     }
    // }

    //TODO: ask scott idk how this works
    // private async getUser(req: Request, res: Response): Promise<void> {
    //     let reqBody: GetOsuUserRequest = res.locals.input;

    //     try {
    //         const { data } = await this.localApi.get('/osu/auth-token');
    //         const authToken = data.token;
    //         const config = {
    //             headers: { Authorization: `Bearer ${authToken}` },
    //         };
    //         console.log(reqBody);
    //     } catch (err) {
    //         console.log(err);
    //     }
    // }
}
