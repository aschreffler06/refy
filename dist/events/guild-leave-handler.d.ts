import { Guild } from 'discord.js';
import { EventHandler } from './index.js';
export declare class GuildLeaveHandler implements EventHandler {
    process(guild: Guild): Promise<void>;
}
