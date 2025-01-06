import {
    ApplicationCommandType,
    PermissionFlagsBits,
    PermissionsBitField,
    RESTPostAPIChatInputApplicationCommandsJSONBody,
    RESTPostAPIContextMenuApplicationCommandsJSONBody,
} from 'discord.js';

import { Args } from './index.js';
import { Language } from '../models/enum-helpers/index.js';
import { Lang } from '../services/index.js';

export const ChatCommandMetadata: {
    [command: string]: RESTPostAPIChatInputApplicationCommandsJSONBody;
} = {
    // HELP: {
    //     type: ApplicationCommandType.ChatInput,
    //     name: Lang.getRef('chatCommands.help', Language.Default),
    //     name_localizations: Lang.getRefLocalizationMap('chatCommands.help'),
    //     description: Lang.getRef('commandDescs.help', Language.Default),
    //     description_localizations: Lang.getRefLocalizationMap('commandDescs.help'),
    //     dm_permission: true,
    //     default_member_permissions: undefined,
    //     options: [
    //         {
    //             ...Args.HELP_OPTION,
    //             required: true,
    //         },
    //     ],
    // },
    // INFO: {
    //     type: ApplicationCommandType.ChatInput,
    //     name: Lang.getRef('chatCommands.info', Language.Default),
    //     name_localizations: Lang.getRefLocalizationMap('chatCommands.info'),
    //     description: Lang.getRef('commandDescs.info', Language.Default),
    //     description_localizations: Lang.getRefLocalizationMap('commandDescs.info'),
    //     dm_permission: true,
    //     default_member_permissions: undefined,
    //     options: [
    //         {
    //             ...Args.INFO_OPTION,
    //             required: true,
    //         },
    //     ],
    // },
    // TEST: {
    //     type: ApplicationCommandType.ChatInput,
    //     name: Lang.getRef('chatCommands.test', Language.Default),
    //     name_localizations: Lang.getRefLocalizationMap('chatCommands.test'),
    //     description: Lang.getRef('commandDescs.test', Language.Default),
    //     description_localizations: Lang.getRefLocalizationMap('commandDescs.test'),
    //     dm_permission: true,
    //     default_member_permissions: undefined,
    // },
    // AUCTION_SETUP: {
    //     type: ApplicationCommandType.ChatInput,
    //     name: Lang.getRef('chatCommands.auctionSetup', Language.Default),
    //     description: Lang.getRef('commandDescs.auctionSetup', Language.Default),
    //     dm_permission: true,
    //     default_member_permissions: PermissionsBitField.resolve([
    //         PermissionFlagsBits.ManageGuild,
    //     ]).toString(),
    // },
    // AUCTION_BALANCE: {
    //     type: ApplicationCommandType.ChatInput,
    //     name: Lang.getRef('chatCommands.auctionBalance', Language.Default),
    //     description: Lang.getRef('commandDescs.auctionBalance', Language.Default),
    //     dm_permission: true,
    //     options: [
    //         {
    //             ...Args.SHOW_ALL,
    //         },
    //     ],
    // },
    // AUCTION_TEAM: {
    //     type: ApplicationCommandType.ChatInput,
    //     name: Lang.getRef('chatCommands.auctionTeam', Language.Default),
    //     description: Lang.getRef('commandDescs.auctionTeam', Language.Default),
    //     dm_permission: true,
    // },
    // AUCTION_DISPLAY: {
    //     type: ApplicationCommandType.ChatInput,
    //     name: Lang.getRef('chatCommands.auctionDisplay', Language.Default),
    //     description: Lang.getRef('commandDescs.auctionDisplay', Language.Default),
    //     dm_permission: true,
    //     default_member_permissions: undefined,
    // },
    // AUCTION_START: {
    //     type: ApplicationCommandType.ChatInput,
    //     name: Lang.getRef('chatCommands.auctionStart', Language.Default),
    //     description: Lang.getRef('commandDescs.auctionStart', Language.Default),
    //     dm_permission: true,
    //     default_member_permissions: PermissionsBitField.resolve([
    //         PermissionFlagsBits.ManageGuild,
    //     ]).toString(),
    //     options: [
    //         {
    //             ...Args.NAME,
    //             required: true,
    //         },
    //     ],
    // },
    // AUCTION_SALE: {
    //     type: ApplicationCommandType.ChatInput,
    //     name: Lang.getRef('chatCommands.auctionSale', Language.Default),
    //     description: Lang.getRef('commandDescs.auctionSale', Language.Default),
    //     dm_permission: true,
    //     default_member_permissions: PermissionsBitField.resolve([
    //         PermissionFlagsBits.ManageGuild,
    //     ]).toString(),
    //     options: [
    //         {
    //             ...Args.NAME,
    //             required: true,
    //         },
    //     ],
    // },
    // CREATE_TICKET: {
    //     type: ApplicationCommandType.ChatInput,
    //     name: Lang.getRef('chatCommands.createTicket', Language.Default),
    //     description: Lang.getRef('commandDescs.createTicket', Language.Default),
    //     dm_permission: true,
    //     default_member_permissions: undefined,
    // },
    LINK: {
        type: ApplicationCommandType.ChatInput,
        name: Lang.getRef('chatCommands.link', Language.Default),
        description: Lang.getRef('commandDescs.link', Language.Default),
        dm_permission: true,
        default_member_permissions: undefined,
        options: [
            {
                ...Args.NAME,
                required: true,
            },
        ],
    },
    PP_CREATE_LEADERBOARD: {
        type: ApplicationCommandType.ChatInput,
        name: Lang.getRef('chatCommands.ppCreateLeaderboard', Language.Default),
        description: Lang.getRef('commandDescs.ppCreateLeaderboard', Language.Default),
        dm_permission: true,
        default_member_permissions: PermissionsBitField.resolve([
            PermissionFlagsBits.ManageGuild,
        ]).toString(),
        options: [
            {
                ...Args.LOWER_RANK,
                required: true,
            },
            {
                ...Args.UPPER_RANK,
                required: true,
            },
        ],
    },
    PP_CREATE_MATCH: {
        type: ApplicationCommandType.ChatInput,
        name: Lang.getRef('chatCommands.ppCreateMatch', Language.Default),
        description: Lang.getRef('commandDescs.ppCreateMatch', Language.Default),
        dm_permission: true,
        default_member_permissions: PermissionsBitField.resolve([
            PermissionFlagsBits.ManageGuild,
        ]).toString(),
        options: [
            {
                ...Args.NAME,
                required: true,
            },
        ],
    },
    PP_CREATE_TEAM: {
        type: ApplicationCommandType.ChatInput,
        name: Lang.getRef('chatCommands.ppCreateTeam', Language.Default),
        description: Lang.getRef('commandDescs.ppCreateTeam', Language.Default),
        dm_permission: true,
        default_member_permissions: PermissionsBitField.resolve([
            PermissionFlagsBits.ManageGuild,
        ]).toString(),
        options: [
            {
                ...Args.NAME,
                required: true,
            },
        ],
    },
    PP_DISPLAY: {
        type: ApplicationCommandType.ChatInput,
        name: Lang.getRef('chatCommands.ppDisplay', Language.Default),
        description: Lang.getRef('commandDescs.ppDisplay', Language.Default),
        dm_permission: true,
        default_member_permissions: undefined,
        // options: [
        //     {
        //         ...Args.SHOW_ALL,
        //     },
        // ],
    },
    PP_DISPLAY_TOTAL: {
        type: ApplicationCommandType.ChatInput,
        name: Lang.getRef('chatCommands.ppDisplayTotal', Language.Default),
        description: Lang.getRef('commandDescs.ppDisplayTotal', Language.Default),
        dm_permission: true,
        default_member_permissions: undefined,
    },
    PP_GET_SCORE: {
        type: ApplicationCommandType.ChatInput,
        name: Lang.getRef('chatCommands.ppGetScore', Language.Default),
        description: Lang.getRef('commandDescs.ppGetScore', Language.Default),
        dm_permission: true,
        default_member_permissions: undefined,
        options: [
            {
                ...Args.ID,
                required: true,
            },
        ],
    },
    PP_JOIN_TEAM: {
        type: ApplicationCommandType.ChatInput,
        name: Lang.getRef('chatCommands.ppJoinTeam', Language.Default),
        description: Lang.getRef('commandDescs.ppJoinTeam', Language.Default),
        dm_permission: true,
        default_member_permissions: undefined,
        options: [
            {
                ...Args.NAME,
                required: true,
            },
        ],
    },
    PP_SUBMIT_PLAY: {
        type: ApplicationCommandType.ChatInput,
        name: Lang.getRef('chatCommands.ppSubmitPlay', Language.Default),
        description: Lang.getRef('commandDescs.ppSubmitPlay', Language.Default),
        dm_permission: true,
        default_member_permissions: undefined,
        options: [
            {
                ...Args.RECENT,
                required: false,
            },
        ],
    },
    PP_USER_STATS: {
        type: ApplicationCommandType.ChatInput,
        name: Lang.getRef('chatCommands.ppUserStats', Language.Default),
        description: Lang.getRef('commandDescs.ppUserStats', Language.Default),
        dm_permission: true,
        default_member_permissions: undefined,
    },
};

export const MessageCommandMetadata: {
    [command: string]: RESTPostAPIContextMenuApplicationCommandsJSONBody;
} = {
    VIEW_DATE_SENT: {
        type: ApplicationCommandType.Message,
        name: Lang.getRef('messageCommands.viewDateSent', Language.Default),
        name_localizations: Lang.getRefLocalizationMap('messageCommands.viewDateSent'),
        default_member_permissions: undefined,
        dm_permission: true,
    },
};

export const UserCommandMetadata: {
    [command: string]: RESTPostAPIContextMenuApplicationCommandsJSONBody;
} = {
    VIEW_DATE_JOINED: {
        type: ApplicationCommandType.User,
        name: Lang.getRef('userCommands.viewDateJoined', Language.Default),
        name_localizations: Lang.getRefLocalizationMap('userCommands.viewDateJoined'),
        default_member_permissions: undefined,
        dm_permission: true,
    },
};
