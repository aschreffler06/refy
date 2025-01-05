/**
 * @description Setup command for auction. This command will create a new auction in the database.
 */

//TODO: find the bug that causes the model to not submit (still goes into db)

// eslint-disable-next-line import/no-extraneous-dependencies
import { parse } from 'csv-parse';
import {
    ButtonStyle,
    CacheType,
    ChatInputCommandInteraction,
    ComponentType,
    ModalBuilder,
    ModalSubmitInteraction,
    PermissionsString,
    TextInputStyle,
} from 'discord.js';
import { CollectorUtils } from 'discord.js-collector-utils';
import { RateLimiter } from 'discord.js-rate-limiter';
import * as fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { OsuController } from '../../controllers/osu-controller.js';
import { UserNotInGuildError } from '../../error/index.js';
import { OsuUserInfoDTO } from '../../models/data-objects/index.js';
import { Auction } from '../../models/database/index.js';
import { Language } from '../../models/enum-helpers/index.js';
import { EventData } from '../../models/internal-models.js';
import { Lang } from '../../services/index.js';
import { InteractionUtils } from '../../utils/index.js';
import { Command, CommandDeferType } from '../index.js';

const __fileName = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__fileName);

export class AuctionSetupCommand implements Command {
    public names = [Lang.getRef('chatCommands.auctionSetup', Language.Default)];
    public cooldown = new RateLimiter(1, 5000);
    public deferType = CommandDeferType.HIDDEN;
    public requireClientPerms: PermissionsString[] = [];

    public async execute(intr: ChatInputCommandInteraction, data: EventData): Promise<void> {
        if ((await Auction.find({ guild_id: intr.guildId }).count()) > 0) {
            await InteractionUtils.send(
                intr,
                `I'm sorry but at the current moment, only 1 auction is supported per server. Please end the current auction before creating a new one (/auction-delete).`
            );
            return;
        }
        const players = await readPlayers();
        const auctionCreatePrompt = await InteractionUtils.send(
            intr,
            {
                content: `For this setup, you will need to have a list of the bidders' discord ids. These should be comma separated.`,
                components: [
                    {
                        type: ComponentType.ActionRow,
                        components: [
                            {
                                type: ComponentType.Button,
                                customId: 'auctionCreate',
                                label: Lang.getRef('button.create', data.lang),
                                style: ButtonStyle.Primary,
                            },
                        ],
                    },
                ],
            },
            true
        );

        const auctionCreateResult = await CollectorUtils.collectByModal(
            auctionCreatePrompt,
            new ModalBuilder({
                customId: 'auctionCreateModal',
                title: 'Create Auction',
                components: [
                    {
                        type: ComponentType.ActionRow,
                        components: [
                            {
                                type: ComponentType.TextInput,
                                customId: 'auctionName',
                                label: 'Auction Name',
                                placeholder: 'Auction Name',
                                style: TextInputStyle.Short,
                                required: true,
                            },
                        ],
                    },
                    {
                        type: ComponentType.ActionRow,
                        components: [
                            {
                                type: ComponentType.TextInput,
                                customId: 'startingCash',
                                label: 'Starting Cash',
                                placeholder: 'Input starting cash for each bidder',
                                style: TextInputStyle.Short,
                                required: true,
                            },
                        ],
                    },
                    {
                        type: ComponentType.ActionRow,
                        components: [
                            {
                                type: ComponentType.TextInput,
                                customId: 'bidders',
                                label: 'Bidders',
                                placeholder: 'Input bidders discord ids  separated by commas',
                                style: TextInputStyle.Paragraph,
                                required: true,
                                minLength: 1,
                            },
                        ],
                    },
                ],
            }),

            async modalSubmitInteraction => {
                const auctionName = modalSubmitInteraction.components[0].components[0];
                const startingCash = modalSubmitInteraction.components[1].components[0];
                const bidders = modalSubmitInteraction.components[2].components[0];
                if (
                    auctionName.type !== ComponentType.TextInput ||
                    startingCash.type !== ComponentType.TextInput ||
                    bidders.type !== ComponentType.TextInput
                ) {
                    return;
                }

                let biddersList;
                try {
                    biddersList = await cleanBidders(bidders.value, modalSubmitInteraction);
                } catch (error) {
                    await InteractionUtils.send(modalSubmitInteraction, error.toString(), true);
                    return;
                }
                return {
                    intr: modalSubmitInteraction,
                    value: {
                        name: auctionName.value,
                        startingCash: startingCash.value,
                        bidders: biddersList,
                    },
                };
            }
        );

        if (auctionCreateResult === undefined) {
            return;
        }

        if (await Auction.exists({ name: auctionCreateResult.value.name })) {
            await InteractionUtils.send(
                auctionCreateResult.intr,
                `Auction with name ${auctionCreateResult.value.name} already exists. Please rerun the command and choose a different name.`,
                true
            );
            return;
        }

        const bidders = auctionCreateResult.value.bidders.map(bidder => {
            return {
                _id: bidder,
                cash: auctionCreateResult.value.startingCash,
                items: [],
            };
        });

        const auction = new Auction({
            guild_id: auctionCreateResult.intr.guildId,
            name: auctionCreateResult.value.name,
            starting_cash: auctionCreateResult.value.startingCash,
            bidders: bidders,
            players: players,
        });

        await auction.save();

        await InteractionUtils.send(auctionCreateResult.intr, 'Auction created!', true);
    }
}

async function cleanBidders(
    bidders: string,
    modalSubmitInteraction: ModalSubmitInteraction<CacheType>
): Promise<string[]> {
    let biddersList = bidders.split(',');
    biddersList = biddersList.map(bidder => bidder.trim());
    const guild = await modalSubmitInteraction.client.guilds.fetch(modalSubmitInteraction.guildId);
    for (const bidderId of biddersList) {
        try {
            await guild.members.fetch(bidderId);
        } catch (error) {
            throw new UserNotInGuildError(bidderId);
        }
    }
    return biddersList;
}

async function readPlayers(): Promise<string[][]> {
    //PLAYER STUFF ITS HARDCODED WITH A CSV YEP HAHAHAA
    const csvFilePath = path.resolve(__dirname, '../../../AAAH3Quals.csv');

    const headers = [
        'seed',
        'username',
        'id',
        'rank',
        'description',
        'averagescore',
        'bestmap',
        'bestmaprank',
        'bestmapscore',
    ];

    const fileContent = fs.readFileSync(csvFilePath, 'utf8');
    let players = [];
    await new Promise<void>((resolve, reject) => {
        parse(
            fileContent,
            {
                delimiter: ',',
                columns: headers,
            },
            (error: any, result: string[][]) => {
                if (error) {
                    console.error(error);
                    reject(error);
                    return;
                }
                players = result.map(player => {
                    return {
                        _id: player['id'],
                        name: player['username'],
                        seed: parseInt(player['seed']),
                        rank: parseInt(player['rank']),
                        description: player['description'],
                        averageScore: parseInt(player['averagescore']),
                        bestMap: player['bestmap'],
                        bestMapRank: player['bestmaprank'],
                        bestMapScore: parseInt(player['bestmapscore']),
                    };
                });
                resolve();
            }
        );
    });
    console.log(players);

    const osuController = new OsuController();
    for (let i = 0; i < players.length; i++) {
        const player = players[i];
        const userInfo: OsuUserInfoDTO = await osuController.getUser({
            username: player['name'],
        });
        player['avatar'] = userInfo.avatar;
        console.log(player);
    }

    return players;
}
