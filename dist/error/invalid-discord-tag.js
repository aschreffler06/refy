export class InvalidDiscordTagError extends Error {
    constructor(tag) {
        super(`Invalid discord tag: ${tag}. Please fix the formatting and try again`);
    }
}
//# sourceMappingURL=invalid-discord-tag.js.map