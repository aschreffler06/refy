/**
 * This class contains all the sanitizers for the bot
 */

export class SanitizerUtils {
    /**
     * Makes sure that a discord name is of the right format
     * @param name the name to sanitize
     * @returns whether the name is valid or not
     */
    public static sanitizeDiscordId(name: string): boolean {
        const sanitize = new RegExp('^.{2,32}#[0-9]{4}$');
        return sanitize.test(name);
    }
}
