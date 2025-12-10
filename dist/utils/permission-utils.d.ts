import { Channel } from 'discord.js';
export declare class PermissionUtils {
    static canSend(channel: Channel, embedLinks?: boolean): boolean;
    static canMention(channel: Channel): boolean;
    static canReact(channel: Channel, removeOthers?: boolean): boolean;
    static canPin(channel: Channel, findOld?: boolean): boolean;
    static canCreateThreads(channel: Channel, manageThreads?: boolean, findOld?: boolean): boolean;
}
