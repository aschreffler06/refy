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
export class InteractionUtils {
    static async deferReply(intr, hidden = false) {
        try {
            return await intr.deferReply({
                ephemeral: hidden,
            });
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
    static async deferUpdate(intr) {
        try {
            return await intr.deferUpdate();
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
    static async send(intr, content, hidden = false) {
        try {
            let options = typeof content === 'string'
                ? { content }
                : content instanceof EmbedBuilder
                    ? { embeds: [content] }
                    : content;
            if (intr.deferred || intr.replied) {
                return await intr.followUp({
                    ...options,
                    ephemeral: hidden,
                });
            }
            else {
                return await intr.reply({
                    ...options,
                    ephemeral: hidden,
                    fetchReply: true,
                });
            }
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
    static async respond(intr, choices = []) {
        try {
            return await intr.respond(choices);
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
    static async editReply(intr, content) {
        try {
            let options = typeof content === 'string'
                ? { content }
                : content instanceof EmbedBuilder
                    ? { embeds: [content] }
                    : content;
            return await intr.editReply(options);
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
    static async update(intr, content) {
        try {
            let options = typeof content === 'string'
                ? { content }
                : content instanceof EmbedBuilder
                    ? { embeds: [content] }
                    : content;
            return await intr.update({
                ...options,
                fetchReply: true,
            });
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
//# sourceMappingURL=interaction-utils.js.map