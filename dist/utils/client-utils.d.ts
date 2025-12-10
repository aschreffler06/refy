import { ApplicationCommand, Channel, Client, Guild, GuildMember, Locale, NewsChannel, Role, StageChannel, TextChannel, User, VoiceChannel } from 'discord.js';
export declare class ClientUtils {
    static getGuild(client: Client, discordId: string): Promise<Guild>;
    static getChannel(client: Client, discordId: string): Promise<Channel>;
    static getUser(client: Client, discordId: string): Promise<User>;
    static findAppCommand(client: Client, name: string): Promise<ApplicationCommand>;
    static findMember(guild: Guild, input: string): Promise<GuildMember>;
    static findRole(guild: Guild, input: string): Promise<Role>;
    static findTextChannel(guild: Guild, input: string): Promise<NewsChannel | TextChannel>;
    static findVoiceChannel(guild: Guild, input: string): Promise<VoiceChannel | StageChannel>;
    static findNotifyChannel(guild: Guild, langCode: Locale): Promise<TextChannel | NewsChannel>;
}
