import { escapeMarkdown } from 'discord.js';
import removeMarkdown from 'remove-markdown';
export class StringUtils {
    static truncate(input, length, addEllipsis = false) {
        if (input.length <= length) {
            return input;
        }
        let output = input.substring(0, addEllipsis ? length - 3 : length);
        if (addEllipsis) {
            output += '...';
        }
        return output;
    }
    static escapeMarkdown(input) {
        return (escapeMarkdown(input)
            // Unescapes custom emojis
            // TODO: Update once discord.js update their escapeMarkdown()
            // See https://github.com/discordjs/discord.js/issues/8943
            .replaceAll(/<(a?):(\S+):(\d{17,20})>/g, (_match, animatedPrefix, emojiName, emojiId) => {
            let emojiNameUnescaped = emojiName.replaceAll(/\\/g, '');
            return `<${animatedPrefix}:${emojiNameUnescaped}:${emojiId}>`;
        }));
    }
    static stripMarkdown(input) {
        return removeMarkdown(input);
    }
}
//# sourceMappingURL=string-utils.js.map