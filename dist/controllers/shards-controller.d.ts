import { ShardingManager } from 'discord.js';
import { Router } from 'express';
import { Controller } from './index.js';
export declare class ShardsController implements Controller {
    private shardManager;
    path: string;
    router: Router;
    authToken: string;
    constructor(shardManager: ShardingManager);
    register(): void;
    private getShards;
    private setShardPresences;
}
