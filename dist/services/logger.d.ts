export declare class Logger {
    private static shardId;
    static info(message: string, obj?: any): void;
    static warn(message: string, obj?: any): void;
    static error(message: string, obj?: any): Promise<void>;
    static setShardId(shardId: number): void;
}
