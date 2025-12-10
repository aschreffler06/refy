import { ActivityType } from 'discord.js';
import router from 'express-promise-router';
import { createRequire } from 'node:module';
import { mapClass } from '../middleware/index.js';
import { SetShardPresencesRequest, } from '../models/cluster-api/index.js';
import { Logger } from '../services/index.js';
const require = createRequire(import.meta.url);
let Config = require('../../config/config.json');
let Logs = require('../../lang/logs.json');
export class ShardsController {
    constructor(shardManager) {
        this.shardManager = shardManager;
        this.path = '/shards';
        this.router = router();
        this.authToken = Config.api.secret;
    }
    register() {
        this.router.get('/', (req, res) => this.getShards(req, res));
        this.router.put('/presence', mapClass(SetShardPresencesRequest), (req, res) => this.setShardPresences(req, res));
    }
    async getShards(req, res) {
        let shardDatas = await Promise.all(this.shardManager.shards.map(async (shard) => {
            let shardInfo = {
                id: shard.id,
                ready: shard.ready,
                error: false,
            };
            try {
                let uptime = (await shard.fetchClientValue('uptime'));
                shardInfo.uptimeSecs = Math.floor(uptime / 1000);
            }
            catch (error) {
                Logger.error(Logs.error.managerShardInfo, error);
                shardInfo.error = true;
            }
            return shardInfo;
        }));
        let stats = {
            shardCount: this.shardManager.shards.size,
            uptimeSecs: Math.floor(process.uptime()),
        };
        let resBody = {
            shards: shardDatas,
            stats,
        };
        res.status(200).json(resBody);
    }
    async setShardPresences(req, res) {
        let reqBody = res.locals.input;
        await this.shardManager.broadcastEval((client, context) => {
            return client.setPresence(context.type, context.name, context.url);
        }, { context: { type: ActivityType[reqBody.type], name: reqBody.name, url: reqBody.url } });
        res.sendStatus(200);
    }
}
//# sourceMappingURL=shards-controller.js.map