import { Locale } from 'discord.js';
interface LanguageData {
    englishName: string;
    nativeName: string;
}
export declare class Language {
    static Default: Locale;
    static Enabled: Locale[];
    static Data: {
        [key in Locale]: LanguageData;
    };
    static find(input: string, enabled: boolean): Locale;
    static findMultiple(input: string, enabled: boolean, limit?: number): Locale[];
}
export {};
