import { createRequire } from 'node:module';
import { Logger } from '../services/index.js';
const require = createRequire(import.meta.url);
let Config = require('../../config/config.json');
let Debug = require('../../config/debug.json');
let Logs = require('../../lang/logs.json');
export class Manager {
    constructor(shardManager, jobService) {
        this.shardManager = shardManager;
        this.jobService = jobService;
    }
    async start() {
        this.registerListeners();
        let shardList = this.shardManager.shardList;
        try {
            Logger.info(Logs.info.managerSpawningShards
                .replaceAll('{SHARD_COUNT}', shardList.length.toLocaleString())
                .replaceAll('{SHARD_LIST}', shardList.join(', ')));
            await this.shardManager.spawn({
                amount: this.shardManager.totalShards,
                delay: Config.sharding.spawnDelay * 1000,
                timeout: Config.sharding.spawnTimeout * 1000,
            });
            Logger.info(Logs.info.managerAllShardsSpawned);
        }
        catch (error) {
            Logger.error(Logs.error.managerSpawningShards, error);
            return;
        }
        if (Debug.dummyMode.enabled) {
            return;
        }
        this.jobService.start();
    }
    registerListeners() {
        this.shardManager.on('shardCreate', shard => this.onShardCreate(shard));
    }
    onShardCreate(shard) {
        Logger.info(Logs.info.managerLaunchedShard.replaceAll('{SHARD_ID}', shard.id.toString()));
    }
}
//# sourceMappingURL=manager.js.map