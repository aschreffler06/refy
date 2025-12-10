import { DiscordAPIError, RESTJSONErrorCodes as DiscordApiErrors, EmbedBuilder, } from 'discord.js';
const IGNORED_ERRORS = [
    DiscordApiErrors.UnknownMessage,
    DiscordApiErrors.UnknownChannel,
    DiscordApiErrors.UnknownGuild,
    DiscordApiErrors.UnknownUser,
    DiscordApiErrors.UnknownInteraction,
    DiscordApiErrors.CannotSendMessagesToThisUser,
    DiscordApiErrors.ReactionWasBlocked,
    DiscordApiErrors.MaximumActiveThreads,
];
export class MessageUtils {
    static async send(target, content) {
        try {
            let options = typeof content === 'string'
                ? { content }
                : content instanceof EmbedBuilder
                    ? { embeds: [content] }
                    : content;
            return await target.send(options);
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
    static async reply(msg, content) {
        try {
            let options = typeof content === 'string'
                ? { content }
                : content instanceof EmbedBuilder
                    ? { embeds: [content] }
                    : content;
            return await msg.reply(options);
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
    static async edit(msg, content) {
        try {
            let options = typeof content === 'string'
                ? { content }
                : content instanceof EmbedBuilder
                    ? { embeds: [content] }
                    : content;
            return await msg.edit(options);
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
    static async react(msg, emoji) {
        try {
            return await msg.react(emoji);
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
    static async pin(msg, pinned = true) {
        try {
            return pinned ? await msg.pin() : await msg.unpin();
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
    static async startThread(msg, options) {
        try {
            return await msg.startThread(options);
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
    static async delete(msg) {
        try {
            return await msg.delete();
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
}
//# sourceMappingURL=message-utils.js.map