export declare class DatabaseUtils {
    static connectDB(): Promise<void>;
    static connectDBForTesting(): Promise<void>;
    static disconnectDBForTesting(): Promise<void>;
}
