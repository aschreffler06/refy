import { DMChannel, GuildChannel, PermissionFlagsBits, ThreadChannel } from 'discord.js';
export class PermissionUtils {
    static canSend(channel, embedLinks = false) {
        if (channel instanceof DMChannel) {
            return true;
        }
        else if (channel instanceof GuildChannel || channel instanceof ThreadChannel) {
            let channelPerms = channel.permissionsFor(channel.client.user);
            if (!channelPerms) {
                // This can happen if the guild disconnected while a collector is running
                return false;
            }
            // VIEW_CHANNEL - Needed to view the channel
            // SEND_MESSAGES - Needed to send messages
            // EMBED_LINKS - Needed to send embedded links
            return channelPerms.has([
                PermissionFlagsBits.ViewChannel,
                PermissionFlagsBits.SendMessages,
                ...(embedLinks ? [PermissionFlagsBits.EmbedLinks] : []),
            ]);
        }
        else {
            return false;
        }
    }
    static canMention(channel) {
        if (channel instanceof DMChannel) {
            return true;
        }
        else if (channel instanceof GuildChannel || channel instanceof ThreadChannel) {
            let channelPerms = channel.permissionsFor(channel.client.user);
            if (!channelPerms) {
                // This can happen if the guild disconnected while a collector is running
                return false;
            }
            // VIEW_CHANNEL - Needed to view the channel
            // MENTION_EVERYONE - Needed to mention @everyone, @here, and all roles
            return channelPerms.has([
                PermissionFlagsBits.ViewChannel,
                PermissionFlagsBits.MentionEveryone,
            ]);
        }
        else {
            return false;
        }
    }
    static canReact(channel, removeOthers = false) {
        if (channel instanceof DMChannel) {
            return true;
        }
        else if (channel instanceof GuildChannel || channel instanceof ThreadChannel) {
            let channelPerms = channel.permissionsFor(channel.client.user);
            if (!channelPerms) {
                // This can happen if the guild disconnected while a collector is running
                return false;
            }
            // VIEW_CHANNEL - Needed to view the channel
            // ADD_REACTIONS - Needed to add new reactions to messages
            // READ_MESSAGE_HISTORY - Needed to add new reactions to messages
            //    https://discordjs.guide/popular-topics/permissions-extended.html#implicit-permissions
            // MANAGE_MESSAGES - Needed to remove others reactions
            return channelPerms.has([
                PermissionFlagsBits.ViewChannel,
                PermissionFlagsBits.AddReactions,
                PermissionFlagsBits.ReadMessageHistory,
                ...(removeOthers ? [PermissionFlagsBits.ManageMessages] : []),
            ]);
        }
        else {
            return false;
        }
    }
    static canPin(channel, findOld = false) {
        if (channel instanceof DMChannel) {
            return true;
        }
        else if (channel instanceof GuildChannel || channel instanceof ThreadChannel) {
            let channelPerms = channel.permissionsFor(channel.client.user);
            if (!channelPerms) {
                // This can happen if the guild disconnected while a collector is running
                return false;
            }
            // VIEW_CHANNEL - Needed to view the channel
            // MANAGE_MESSAGES - Needed to pin messages
            // READ_MESSAGE_HISTORY - Needed to find old pins
            return channelPerms.has([
                PermissionFlagsBits.ViewChannel,
                PermissionFlagsBits.ManageMessages,
                ...(findOld ? [PermissionFlagsBits.ReadMessageHistory] : []),
            ]);
        }
        else {
            return false;
        }
    }
    static canCreateThreads(channel, manageThreads = false, findOld = false) {
        if (channel instanceof DMChannel) {
            return false;
        }
        else if (channel instanceof GuildChannel || channel instanceof ThreadChannel) {
            let channelPerms = channel.permissionsFor(channel.client.user);
            if (!channelPerms) {
                // This can happen if the guild disconnected while a collector is running
                return false;
            }
            // VIEW_CHANNEL - Needed to view the channel
            // SEND_MESSAGES_IN_THREADS - Needed to send messages in threads
            // CREATE_PUBLIC_THREADS - Needed to create public threads
            // MANAGE_THREADS - Needed to rename, delete, archive, unarchive, slow mode threads
            // READ_MESSAGE_HISTORY - Needed to find old threads
            return channelPerms.has([
                PermissionFlagsBits.ViewChannel,
                PermissionFlagsBits.SendMessagesInThreads,
                PermissionFlagsBits.CreatePublicThreads,
                ...(manageThreads ? [PermissionFlagsBits.ManageThreads] : []),
                ...(findOld ? [PermissionFlagsBits.ReadMessageHistory] : []),
            ]);
        }
        else {
            return false;
        }
    }
}
//# sourceMappingURL=permission-utils.js.map