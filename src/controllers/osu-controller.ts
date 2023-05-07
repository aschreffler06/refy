import axios from 'axios';
import { Request, Response, Router } from 'express';
import router from 'express-promise-router';
import { createRequire } from 'node:module';

import { Controller } from './controller.js';
import { GetAuthTokenResponse } from '../models/osu-api/index.js';

const require = createRequire(import.meta.url);
let Config = require('../../config/config.json');

export class OsuController implements Controller {
    public path = '/osu';
    public router: Router = router();
    public authToken?: string;

    public register(): void {
        this.router.get('/access-token', (req, res) => this.getToken(req, res));
    }

    private async getToken(req: Request, res: Response): Promise<void> {
        const bodyParameters = {
            client_id: Config.osu.id,
            client_secret: Config.osu.secret,
            grant_type: 'client_credentials',
            scope: 'public',
        };

        try {
            const response = await axios.post('https://osu.ppy.sh/oauth/token', bodyParameters);
            const resBody: GetAuthTokenResponse = {
                token: response.data.access_token,
                expiresIn: Number(response.data.expires_in) + Math.trunc(Date.now() / 1000),
            };
            res.status(200).json(resBody);
        } catch (err) {
            res.status(500).send('Error getting access token');
        }
    }
}
