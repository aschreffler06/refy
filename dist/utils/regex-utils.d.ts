export declare class RegexUtils {
    static regex(input: string): RegExp;
    static escapeRegex(input: string): string;
    static discordId(input: string): string;
    static tag(input: string): {
        username: string;
        tag: string;
        discriminator: string;
    };
}
