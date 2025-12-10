export declare class Callback {
    url: string;
    token: string;
}
export declare class RegisterClusterRequest {
    shardCount: number;
    callback: Callback;
}
export interface RegisterClusterResponse {
    id: string;
}
export interface LoginClusterResponse {
    shardList: number[];
    totalShards: number;
}
