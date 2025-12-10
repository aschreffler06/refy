import { ApplicationCommand, Guild, Locale } from 'discord.js';
export declare class FormatUtils {
    static roleMention(guild: Guild, discordId: string): string;
    static channelMention(discordId: string): string;
    static userMention(discordId: string): string;
    static commandMention(command: ApplicationCommand, subParts?: string[]): string;
    static duration(milliseconds: number, langCode: Locale): string;
    static fileSize(bytes: number): string;
}
