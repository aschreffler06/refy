/**
 * @description Command to create a ticket concerning bot issues
 */
import { ButtonStyle, ComponentType, ModalBuilder, TextInputStyle, } from 'discord.js';
import { CollectorUtils } from 'discord.js-collector-utils';
import { RateLimiter } from 'discord.js-rate-limiter';
import { Language } from '../../models/enum-helpers/index.js';
import { Lang } from '../../services/index.js';
import { InteractionUtils } from '../../utils/index.js';
import { CommandDeferType } from '../index.js';
export class CreateTicketCommand {
    constructor() {
        this.names = [Lang.getRef('chatCommands.createTicket', Language.Default)];
        this.cooldown = new RateLimiter(1, 5000);
        this.deferType = CommandDeferType.HIDDEN;
        this.requireClientPerms = [];
    }
    async execute(intr, data) {
        let ticketCreatePrompt = await InteractionUtils.send(intr, {
            content: `Tickets are for bot issues only. If you have a tournament related issues please dm the host.`,
            components: [
                {
                    type: ComponentType.ActionRow,
                    components: [
                        {
                            type: ComponentType.Button,
                            customId: 'ticketCreate',
                            label: Lang.getRef('button.create', data.lang),
                            style: ButtonStyle.Primary,
                        },
                    ],
                },
            ],
        }, true);
        const ticketCreateResult = await CollectorUtils.collectByModal(ticketCreatePrompt, new ModalBuilder({
            customId: 'ticketCreateModal',
            title: 'Create Ticket',
            components: [
                {
                    type: ComponentType.ActionRow,
                    components: [
                        {
                            type: ComponentType.TextInput,
                            customId: 'ticketTitle',
                            label: 'Ticket Title',
                            placeholder: 'Summarize Issue',
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
                            customId: 'ticketDescription',
                            label: 'Ticket Description',
                            placeholder: 'Describe Issue',
                            style: TextInputStyle.Paragraph,
                            required: true,
                        },
                    ],
                },
            ],
        }), async (modalSubmitInteraction) => {
            return await ticketRetriever(modalSubmitInteraction);
        });
        // send message in channel
        //TODO: ticket numbers
        await InteractionUtils.send(ticketCreateResult.intr, `Your ticket has been created. Please wait for a staff member to respond. (this is a lie i haven't finished the functionality for this yet)`, true);
    }
}
async function ticketRetriever(intr) {
    const ticketTitle = intr.components[0].components[0];
    const ticketDescription = intr.components[1].components[0];
    if (ticketTitle.type !== ComponentType.TextInput ||
        ticketDescription.type !== ComponentType.TextInput) {
        return;
    }
    return {
        intr: intr,
        value: {
            title: ticketTitle.value,
            description: ticketDescription.value,
        },
    };
}
//# sourceMappingURL=ticket-create-command.js.map