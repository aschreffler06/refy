import { ThreadChannel } from 'discord.js';
export declare class ThreadUtils {
    static archive(thread: ThreadChannel, archived?: boolean): Promise<ThreadChannel>;
    static lock(thread: ThreadChannel, locked?: boolean): Promise<ThreadChannel>;
}
