/**
 * This class contains all the sanitizers for the bot
 */
export declare class SanitizerUtils {
    /**
     * Makes sure that a discord name is of the right format
     * @param name the name to sanitize
     * @returns whether the name is valid or not
     */
    static sanitizeDiscordId(name: string): boolean;
}
