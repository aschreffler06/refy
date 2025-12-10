import { EmbedBuilder, Locale, LocalizationMap } from 'discord.js';
export declare class Lang {
    private static linguini;
    static getEmbed(location: string, langCode: Locale, variables?: {
        [name: string]: string;
    }): EmbedBuilder;
    static getRegex(location: string, langCode: Locale): RegExp;
    static getRef(location: string, langCode: Locale, variables?: {
        [name: string]: string;
    }): string;
    static getRefLocalizationMap(location: string, variables?: {
        [name: string]: string;
    }): LocalizationMap;
    static getCom(location: string, variables?: {
        [name: string]: string;
    }): string;
    private static embedTm;
}
