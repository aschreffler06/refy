import router from 'express-promise-router';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
let Config = require('../../config/config.json');
export class GuildsController {
    constructor(shardManager) {
        this.shardManager = shardManager;
        this.path = '/guilds';
        this.router = router();
        this.authToken = Config.api.secret;
    }
    register() {
        this.router.get('/', (req, res) => this.getGuilds(req, res));
    }
    async getGuilds(req, res) {
        let guilds = [
            ...new Set((await this.shardManager.broadcastEval(client => [...client.guilds.cache.keys()])).flat()),
        ];
        let resBody = {
            guilds,
        };
        res.status(200).json(resBody);
    }
}
//# sourceMappingURL=guilds-controller.js.map