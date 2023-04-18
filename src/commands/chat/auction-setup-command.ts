/**
 * @description Setup command for auction. This command will create a new auction in the database.
 */

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

import { Auction } from '../../database/index.js';
import { InvalidDiscordTagError, UserNotInGuildError } from '../../error/index.js';
import { Language } from '../../models/enum-helpers/index.js';
import { EventData } from '../../models/internal-models.js';
import { Lang } from '../../services/index.js';
import { InteractionUtils, SanitizerUtils } from '../../utils/index.js';
import { Command, CommandDeferType } from '../index.js';

export class AuctionSetupCommand implements Command {
    public names = [Lang.getRef('chatCommands.auctionSetup', Language.Default)];
    public cooldown = new RateLimiter(1, 5000);
    public deferType = CommandDeferType.HIDDEN;
    public requireClientPerms: PermissionsString[] = [];

    public async execute(intr: ChatInputCommandInteraction, data: EventData): Promise<void> {
        const auctionCreatePrompt = await InteractionUtils.send(
            intr,
            {
                content: `For this setup, you will need to have a list of the bidders' discord tags (ex. solar#0006). These should be comma separated.`,
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
                                customId: 'bidders',
                                label: 'Bidders',
                                placeholder: 'Input bidders discord tags separated by commas',
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
                const bidders = modalSubmitInteraction.components[1].components[0];
                if (
                    auctionName.type !== ComponentType.TextInput ||
                    bidders.type !== ComponentType.TextInput
                ) {
                    return;
                }

                let biddersList;
                try {
                    biddersList = this.cleanBidders(bidders.value, modalSubmitInteraction);
                } catch (error) {
                    await InteractionUtils.send(modalSubmitInteraction, error.toString(), true);
                    return;
                }
                return {
                    intr: modalSubmitInteraction,
                    value: {
                        name: auctionName.value,
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
                `Auction with name ${auctionCreateResult.value.name} already exists. Please choose a different name.`,
                true
            );
            return;
        }

        const auction = new Auction({
            guild_id: auctionCreateResult.intr.guildId,
            name: auctionCreateResult.value.name,
            bidders: auctionCreateResult.value.bidders,
        });

        await auction.save();

        await InteractionUtils.send(auctionCreateResult.intr, 'Auction created!', true);
    }

    private cleanBidders(
        bidders: string,
        modalSubmitInteraction: ModalSubmitInteraction<CacheType>
    ): string[] {
        const biddersList = bidders.split(',');
        biddersList.forEach(function (name: string) {
            if (!SanitizerUtils.sanitizeDiscordId(name)) {
                throw new InvalidDiscordTagError(name);
            }

            const user = modalSubmitInteraction.client.users.cache.find(user => user.tag === name);
            if (user === undefined) {
                throw new UserNotInGuildError(name);
            }
        });
        return biddersList;
    }
}
