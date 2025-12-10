import { ShardingManager } from 'discord.js';
import { HttpService } from '../services/index.js';
import { Job } from './index.js';
export declare class UpdateServerCountJob implements Job {
    private shardManager;
    private httpService;
    name: string;
    schedule: string;
    log: boolean;
    private botSites;
    constructor(shardManager: ShardingManager, httpService: HttpService);
    run(): Promise<void>;
}
