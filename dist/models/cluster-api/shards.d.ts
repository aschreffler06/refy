export interface GetShardsResponse {
    shards: ShardInfo[];
    stats: ShardStats;
}
export interface ShardStats {
    shardCount: number;
    uptimeSecs: number;
}
export interface ShardInfo {
    id: number;
    ready: boolean;
    error: boolean;
    uptimeSecs?: number;
}
export declare class SetShardPresencesRequest {
    type: string;
    name: string;
    url: string;
}
