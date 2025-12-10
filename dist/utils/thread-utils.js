import { DiscordAPIError, RESTJSONErrorCodes as DiscordApiErrors } from 'discord.js';
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
export class ThreadUtils {
    static async archive(thread, archived = true) {
        try {
            return await thread.setArchived(archived);
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
    static async lock(thread, locked = true) {
        try {
            return await thread.setLocked(locked);
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
//# sourceMappingURL=thread-utils.js.map