export class RegexUtils {
    static regex(input) {
        let match = input.match(/^\/(.*)\/([^/]*)$/);
        if (!match) {
            return;
        }
        return new RegExp(match[1], match[2]);
    }
    static escapeRegex(input) {
        return input?.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
    }
    static discordId(input) {
        return input?.match(/\b\d{17,20}\b/)?.[0];
    }
    static tag(input) {
        let match = input.match(/\b(.+)#([\d]{4})\b/);
        if (!match) {
            return;
        }
        return {
            tag: match[0],
            username: match[1],
            discriminator: match[2],
        };
    }
}
//# sourceMappingURL=regex-utils.js.map