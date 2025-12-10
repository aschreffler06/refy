import { Locale, PermissionsString } from 'discord.js';
interface PermissionData {
    displayName(langCode: Locale): string;
}
export declare class Permission {
    static Data: {
        [key in PermissionsString]: PermissionData;
    };
}
export {};
