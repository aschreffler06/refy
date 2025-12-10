import { ShardClientUtil, ShardingManager } from 'discord.js';
export declare class ShardUtils {
    static requiredShardCount(token: string): Promise<number>;
    static recommendedShardCount(token: string, serversPerShard: number): Promise<number>;
    static shardIds(shardInterface: ShardingManager | ShardClientUtil): number[];
    static shardId(guildId: number | string, shardCount: number): number;
    static serverCount(shardInterface: ShardingManager | ShardClientUtil): Promise<number>;
}
