import { DiscordAPIError, RESTJSONErrorCodes as DiscordApiErrors, } from 'discord.js';
const IGNORED_ERRORS = [
    DiscordApiErrors.UnknownMessage,
    DiscordApiErrors.UnknownChannel,
    DiscordApiErrors.UnknownGuild,
    DiscordApiErrors.UnknownUser,
    DiscordApiErrors.UnknownInteraction,
    DiscordApiErrors.MissingAccess,
];
export class PartialUtils {
    static async fillUser(user) {
        if (user.partial) {
            try {
                return await user.fetch();
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
        return user;
    }
    static async fillMessage(msg) {
        if (msg.partial) {
            try {
                return await msg.fetch();
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
        return msg;
    }
    static async fillReaction(msgReaction) {
        if (msgReaction.partial) {
            try {
                msgReaction = await msgReaction.fetch();
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
        msgReaction.message = await this.fillMessage(msgReaction.message);
        if (!msgReaction.message) {
            return;
        }
        return msgReaction;
    }
}
//# sourceMappingURL=partial-utils.js.map