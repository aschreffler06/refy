import { APIApplicationCommandBasicOption, ApplicationCommandOptionType } from 'discord.js';

import { BountyWinCondition, HelpOption, InfoOption, OsuMod, OsuMode } from '../enums/index.js';
import { Language } from '../models/enum-helpers/index.js';
import { Lang } from '../services/index.js';

export class Args {
    public static readonly HELP_OPTION: APIApplicationCommandBasicOption = {
        name: Lang.getRef('arguments.option', Language.Default),
        name_localizations: Lang.getRefLocalizationMap('arguments.option'),
        description: Lang.getRef('argDescs.helpOption', Language.Default),
        description_localizations: Lang.getRefLocalizationMap('argDescs.helpOption'),
        type: ApplicationCommandOptionType.String,
        choices: [
            {
                name: Lang.getRef('helpOptionDescs.contactSupport', Language.Default),
                name_localizations: Lang.getRefLocalizationMap('helpOptionDescs.contactSupport'),
                value: HelpOption.CONTACT_SUPPORT,
            },
            {
                name: Lang.getRef('helpOptionDescs.commands', Language.Default),
                name_localizations: Lang.getRefLocalizationMap('helpOptionDescs.commands'),
                value: HelpOption.COMMANDS,
            },
        ],
    };
    public static readonly INFO_OPTION: APIApplicationCommandBasicOption = {
        name: Lang.getRef('arguments.option', Language.Default),
        name_localizations: Lang.getRefLocalizationMap('arguments.option'),
        description: Lang.getRef('argDescs.helpOption', Language.Default),
        description_localizations: Lang.getRefLocalizationMap('argDescs.helpOption'),
        type: ApplicationCommandOptionType.String,
        choices: [
            {
                name: Lang.getRef('infoOptions.about', Language.Default),
                name_localizations: Lang.getRefLocalizationMap('infoOptions.about'),
                value: InfoOption.ABOUT,
            },
            {
                name: Lang.getRef('infoOptions.translate', Language.Default),
                name_localizations: Lang.getRefLocalizationMap('infoOptions.translate'),
                value: InfoOption.TRANSLATE,
            },
            {
                name: Lang.getRef('infoOptions.dev', Language.Default),
                name_localizations: Lang.getRefLocalizationMap('infoOptions.dev'),
                value: InfoOption.DEV,
            },
        ],
    };
    public static readonly CHANNEL: APIApplicationCommandBasicOption = {
        name: Lang.getRef('arguments.channel', Language.Default),
        description: Lang.getRef('argDescs.channel', Language.Default),
        type: ApplicationCommandOptionType.Channel,
        required: true,
    };
    public static readonly NAME: APIApplicationCommandBasicOption = {
        name: Lang.getRef('arguments.name', Language.Default),
        description: Lang.getRef('argDescs.name', Language.Default),
        type: ApplicationCommandOptionType.String,
        required: true,
    };
    public static readonly ID: APIApplicationCommandBasicOption = {
        name: Lang.getRef('arguments.id', Language.Default),
        description: Lang.getRef('argDescs.id', Language.Default),
        type: ApplicationCommandOptionType.String,
        required: true,
    };
    public static readonly LOWER_RANK: APIApplicationCommandBasicOption = {
        name: Lang.getRef('arguments.lowerRank', Language.Default),
        description: Lang.getRef('argDescs.lowerRank', Language.Default),
        type: ApplicationCommandOptionType.Integer,
        required: true,
    };
    public static readonly MAP_ID: APIApplicationCommandBasicOption = {
        name: Lang.getRef('arguments.mapId', Language.Default),
        description: Lang.getRef('argDescs.mapId', Language.Default),
        type: ApplicationCommandOptionType.String,
        required: true,
    };
    public static readonly MOD: APIApplicationCommandBasicOption = {
        name: Lang.getRef('arguments.mod', Language.Default),
        description: Lang.getRef('argDescs.mod', Language.Default),
        type: ApplicationCommandOptionType.String,
        required: false,
        choices: [
            {
                name: 'HD',
                value: OsuMod.HD,
            },
            {
                name: 'HR',
                value: OsuMod.HR,
            },
            {
                name: 'DT',
                value: OsuMod.DT,
            },
            {
                name: 'EZ',
                value: OsuMod.EZ,
            },
            {
                name: 'FM',
                value: OsuMod.FM,
            },
        ],
    };
    public static readonly MODE: APIApplicationCommandBasicOption = {
        name: Lang.getRef('arguments.mode', Language.Default),
        description: Lang.getRef('argDescs.mode', Language.Default),
        type: ApplicationCommandOptionType.String,
        choices: [
            {
                name: 'standard',
                value: OsuMode.STANDARD,
            },
            {
                name: 'taiko',
                value: OsuMode.TAIKO,
            },
            {
                name: 'catch',
                value: OsuMode.CATCH,
            },
            {
                name: 'mania',
                value: OsuMode.MANIA,
            },
        ],
        required: false,
    };
    public static readonly RECENT: APIApplicationCommandBasicOption = {
        name: Lang.getRef('arguments.recent', Language.Default),
        description: Lang.getRef('argDescs.recent', Language.Default),
        type: ApplicationCommandOptionType.Number,
        required: false,
    };
    public static readonly SHOW_ALL: APIApplicationCommandBasicOption = {
        name: Lang.getRef('arguments.showAll', Language.Default),
        description: Lang.getRef('argDescs.showAll', Language.Default),
        type: ApplicationCommandOptionType.Boolean,
        required: false,
    };
    public static readonly TEAM1_NAME: APIApplicationCommandBasicOption = {
        name: Lang.getRef('arguments.team1Name', Language.Default),
        description: Lang.getRef('argDescs.team1Name', Language.Default),
        type: ApplicationCommandOptionType.String,
        required: true,
    };
    public static readonly TEAM2_NAME: APIApplicationCommandBasicOption = {
        name: Lang.getRef('arguments.team2Name', Language.Default),
        description: Lang.getRef('argDescs.team2Name', Language.Default),
        type: ApplicationCommandOptionType.String,
        required: true,
    };
    public static readonly UPPER_RANK: APIApplicationCommandBasicOption = {
        name: Lang.getRef('arguments.upperRank', Language.Default),
        description: Lang.getRef('argDescs.upperRank', Language.Default),
        type: ApplicationCommandOptionType.Integer,
        required: true,
    };
    public static readonly VALUE: APIApplicationCommandBasicOption = {
        name: Lang.getRef('arguments.value', Language.Default),
        description: Lang.getRef('argDescs.value', Language.Default),
        type: ApplicationCommandOptionType.Number,
        required: true,
    };
    public static readonly WIN_CONDITION: APIApplicationCommandBasicOption = {
        name: Lang.getRef('arguments.winCondition', Language.Default),
        description: Lang.getRef('argDescs.winCondition', Language.Default),
        type: ApplicationCommandOptionType.String,
        required: true,
        choices: [
            {
                name: 'Accuracy',
                value: BountyWinCondition.ACCURACY,
            },
            {
                name: 'Score',
                value: BountyWinCondition.SCORE,
            },
            {
                name: 'Miss Count',
                value: BountyWinCondition.MISS_COUNT,
            },
            {
                name: 'Pass',
                value: BountyWinCondition.PASS,
            },
            {
                name: 'Combo',
                value: BountyWinCondition.COMBO,
            },
        ],
    };
}
