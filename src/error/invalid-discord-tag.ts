export class InvalidDiscordTagError extends Error {
    constructor(tag: string) {
        super(`Invalid discord tag: ${tag}. Please fix the formatting and try again`);
    }
}
