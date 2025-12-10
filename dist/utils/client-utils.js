import { DiscordAPIError, RESTJSONErrorCodes as DiscordApiErrors, NewsChannel, StageChannel, TextChannel, VoiceChannel, } from 'discord.js';
import { Lang } from '../services/index.js';
import { PermissionUtils, RegexUtils } from './index.js';
const FETCH_MEMBER_LIMIT = 20;
const IGNORED_ERRORS = [
    DiscordApiErrors.UnknownMessage,
    DiscordApiErrors.UnknownChannel,
    DiscordApiErrors.UnknownGuild,
    DiscordApiErrors.UnknownMember,
    DiscordApiErrors.UnknownUser,
    DiscordApiErrors.UnknownInteraction,
    DiscordApiErrors.MissingAccess,
];
export class ClientUtils {
    static async getGuild(client, discordId) {
        discordId = RegexUtils.discordId(discordId);
        if (!discordId) {
            return;
        }
        try {
            return await client.guilds.fetch(discordId);
        }
        catch (error) {
            if (error instanceof DiscordAPIError &&
                typeof error.code == 'number' &&
                IGNORED_ERRORS.includes(error.code)) {
                return;
            }
            else {
                throw error;
            }
        }
    }
    static async getChannel(client, discordId) {
        discordId = RegexUtils.discordId(discordId);
        if (!discordId) {
            return;
        }
        try {
            return await client.channels.fetch(discordId);
        }
        catch (error) {
            if (error instanceof DiscordAPIError &&
                typeof error.code == 'number' &&
                IGNORED_ERRORS.includes(error.code)) {
                return;
            }
            else {
                throw error;
            }
        }
    }
    static async getUser(client, discordId) {
        discordId = RegexUtils.discordId(discordId);
        if (!discordId) {
            return;
        }
        try {
            return await client.users.fetch(discordId);
        }
        catch (error) {
            if (error instanceof DiscordAPIError &&
                typeof error.code == 'number' &&
                IGNORED_ERRORS.includes(error.code)) {
                return;
            }
            else {
                throw error;
            }
        }
    }
    static async findAppCommand(client, name) {
        let commands = await client.application.commands.fetch();
        return commands.find(command => command.name === name);
    }
    static async findMember(guild, input) {
        try {
            let discordId = RegexUtils.discordId(input);
            if (discordId) {
                return await guild.members.fetch(discordId);
            }
            let tag = RegexUtils.tag(input);
            if (tag) {
                return (await guild.members.fetch({ query: tag.username, limit: FETCH_MEMBER_LIMIT })).find(member => member.user.discriminator === tag.discriminator);
            }
            return (await guild.members.fetch({ query: input, limit: 1 })).first();
        }
        catch (error) {
            if (error instanceof DiscordAPIError &&
                typeof error.code == 'number' &&
                IGNORED_ERRORS.includes(error.code)) {
                return;
            }
            else {
                throw error;
            }
        }
    }
    static async findRole(guild, input) {
        try {
            let discordId = RegexUtils.discordId(input);
            if (discordId) {
                return await guild.roles.fetch(discordId);
            }
            let search = input.trim().toLowerCase().replace(/^@/, '');
            let roles = await guild.roles.fetch();
            return (roles.find(role => role.name.toLowerCase() === search) ??
                roles.find(role => role.name.toLowerCase().includes(search)));
        }
        catch (error) {
            if (error instanceof DiscordAPIError &&
                typeof error.code == 'number' &&
                IGNORED_ERRORS.includes(error.code)) {
                return;
            }
            else {
                throw error;
            }
        }
    }
    static async findTextChannel(guild, input) {
        try {
            let discordId = RegexUtils.discordId(input);
            if (discordId) {
                let channel = await guild.channels.fetch(discordId);
                if (channel instanceof NewsChannel || channel instanceof TextChannel) {
                    return channel;
                }
                else {
                    return;
                }
            }
            let search = input.trim().toLowerCase().replace(/^#/, '').replaceAll(' ', '-');
            let channels = [...(await guild.channels.fetch()).values()]
                .filter(channel => channel instanceof NewsChannel || channel instanceof TextChannel)
                .map(channel => channel);
            return (channels.find(channel => channel.name.toLowerCase() === search) ??
                channels.find(channel => channel.name.toLowerCase().includes(search)));
        }
        catch (error) {
            if (error instanceof DiscordAPIError &&
                typeof error.code == 'number' &&
                IGNORED_ERRORS.includes(error.code)) {
                return;
            }
            else {
                throw error;
            }
        }
    }
    static async findVoiceChannel(guild, input) {
        try {
            let discordId = RegexUtils.discordId(input);
            if (discordId) {
                let channel = await guild.channels.fetch(discordId);
                if (channel instanceof VoiceChannel || channel instanceof StageChannel) {
                    return channel;
                }
                else {
                    return;
                }
            }
            let search = input.trim().toLowerCase().replace(/^#/, '');
            let channels = [...(await guild.channels.fetch()).values()]
                .filter(channel => channel instanceof VoiceChannel || channel instanceof StageChannel)
                .map(channel => channel);
            return (channels.find(channel => channel.name.toLowerCase() === search) ??
                channels.find(channel => channel.name.toLowerCase().includes(search)));
        }
        catch (error) {
            if (error instanceof DiscordAPIError &&
                typeof error.code == 'number' &&
                IGNORED_ERRORS.includes(error.code)) {
                return;
            }
            else {
                throw error;
            }
        }
    }
    static async findNotifyChannel(guild, langCode) {
        // Prefer the system channel
        let systemChannel = guild.systemChannel;
        if (systemChannel && PermissionUtils.canSend(systemChannel, true)) {
            return systemChannel;
        }
        // Otherwise look for a bot channel
        return (await guild.channels.fetch()).find(channel => (channel instanceof TextChannel || channel instanceof NewsChannel) &&
            PermissionUtils.canSend(channel, true) &&
            Lang.getRegex('channelRegexes.bot', langCode).test(channel.name));
    }
}
//# sourceMappingURL=client-utils.js.map