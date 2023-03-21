import {
    ButtonStyle,
    ChatInputCommandInteraction,
    ComponentType,
    ModalBuilder,
    PermissionsString,
    TextInputStyle,
} from 'discord.js';
import { CollectorUtils } from 'discord.js-collector-utils';
import { RateLimiter } from 'discord.js-rate-limiter';

import { Language } from '../../models/enum-helpers/index.js';
import { EventData } from '../../models/internal-models.js';
import { Lang } from '../../services/index.js';
import { InteractionUtils } from '../../utils/index.js';
import { Command, CommandDeferType } from '../index.js';

export class CreateTicketCommand implements Command {
    public names = [Lang.getRef('chatCommands.createTicket', Language.Default)];
    public cooldown = new RateLimiter(1, 5000);
    public deferType = CommandDeferType.HIDDEN;
    public requireClientPerms: PermissionsString[] = [];

    public async execute(intr: ChatInputCommandInteraction, data: EventData): Promise<void> {
        let ticketFormatPrompt = await InteractionUtils.send(
            intr,
            {
                embeds: [Lang.getEmbed('displayEmbeds.createTicket', data.lang)],
                components: [
                    {
                        type: ComponentType.ActionRow,
                        components: [
                            {
                                type: ComponentType.Button,
                                customId: 'ticketContinue',
                                label: Lang.getRef('button.continue', data.lang),
                                style: ButtonStyle.Primary,
                            },
                            {
                                type: ComponentType.Button,
                                customId: 'ticketCancel',
                                label: Lang.getRef('button.cancel', data.lang),
                                style: ButtonStyle.Danger,
                            },
                        ],
                    },
                ],
            },
            true
        );

        const ticketFormatResult = await CollectorUtils.collectByButton(
            ticketFormatPrompt,
            // Retrieve Result
            async buttonInteraction => {
                switch (buttonInteraction.customId) {
                    case 'ticketContinue': {
                        return { intr: buttonInteraction, value: 'Continue' };
                    }
                    case 'ticketCancel': {
                        return { intr: buttonInteraction, value: 'Cancel' };
                    }
                    default:
                        return;
                }
            },
            // Options
            {
                time: 120000,
                reset: true,
                target: intr.user,
                stopFilter: message => message.content.toLowerCase() === 'stop',
                onExpire: async () => {
                    await intr.channel?.send({
                        content: 'Too slow! Try being more decisive next time.',
                    });
                },
            }
        );

        if (!ticketFormatResult) {
            return;
        }

        if (ticketFormatResult.value === 'Cancel') {
            await InteractionUtils.send(
                ticketFormatResult.intr,
                Lang.getRef('responses.commandCancelled', data.lang),
                true
            );
            return;
        } else {
            // Create modal for them to submit the ticket
            const ticketInformationResult = await CollectorUtils.collectByModal(
                ticketFormatPrompt,
                // Retrieve Result
                new ModalBuilder({
                    customId: 'ticketModal',
                    title: 'Create a ticket',
                    components: [
                        {
                            type: ComponentType.ActionRow,
                            components: [
                                {
                                    type: ComponentType.TextInput,
                                    customId: 'ticketTitle',
                                    placeholder: 'What is the main issue?',
                                    label: 'Ticket Title',
                                    style: TextInputStyle.Short,
                                },
                            ],
                        },
                        {
                            type: ComponentType.ActionRow,
                            components: [
                                {
                                    type: ComponentType.TextInput,
                                    customId: 'ticketDescription',
                                    placeholder: 'Describe the issue.',
                                    label: 'Ticket Description',
                                    style: TextInputStyle.Paragraph,
                                },
                            ],
                        },
                    ],
                }),

                async modalInteraction => {
                    const ticketTitle = modalInteraction.components[0].components[0];
                    const ticketDescription = modalInteraction.components[1].components[0];
                    return {
                        intr: modalInteraction,
                        value: { title: ticketTitle, description: ticketDescription },
                    };
                },
                // Options
                {
                    time: 120000,
                    reset: true,
                    target: intr.user,
                    stopFilter: message => message.content.toLowerCase() === 'stop',
                    onExpire: async () => {
                        await intr.channel?.send('Too slow! Try being more decisive next time.');
                    },
                }
            );

            if (!ticketInformationResult) {
                return;
            }

            // send message in channel
            await InteractionUtils.send(
                ticketInformationResult.intr,
                `Ticket Title: ${ticketInformationResult.value.title}\nTicket Description: ${ticketInformationResult.value.description}`,
                true
            );
        }
    }
}
