import { ActivityType, Client, ClientOptions, Presence } from 'discord.js';
export declare class CustomClient extends Client {
    constructor(clientOptions: ClientOptions);
    setPresence(type: Exclude<ActivityType, ActivityType.Custom>, name: string, url: string): Presence;
}
