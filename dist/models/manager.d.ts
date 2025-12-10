import { ShardingManager } from 'discord.js';
import { JobService } from '../services/index.js';
export declare class Manager {
    private shardManager;
    private jobService;
    constructor(shardManager: ShardingManager, jobService: JobService);
    start(): Promise<void>;
    private registerListeners;
    private onShardCreate;
}
