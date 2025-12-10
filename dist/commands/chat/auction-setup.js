/**
 * @description Setup command for auction. This command will create a new auction in the database.
 */
import { ButtonStyle, ComponentType, ModalBuilder, TextInputStyle, } from 'discord.js';
import { CollectorUtils } from 'discord.js-collector-utils';
import { RateLimiter } from 'discord.js-rate-limiter';
import { Language } from '../../models/enum-helpers/index.js';
import { Lang } from '../../services/index.js';
import { InteractionUtils } from '../../utils/index.js';
import { CommandDeferType } from '../index.js';
export class AuctionSetupCommand {
    constructor() {
        this.names = [Lang.getRef('chatCommands.test', Language.Default)];
        this.cooldown = new RateLimiter(1, 5000);
        this.deferType = CommandDeferType.HIDDEN;
        this.requireClientPerms = [];
    }
    async execute(intr, data) {
        // prompt to tell them what to do
        // modal to get name of auction and the player discord ids. comma separated.
        // get discord ids from discord names
        // check name to make sure not in db.
        // check to see that player discord ids are in the server
        const auctionCreatePrompt = await InteractionUtils.send(intr, {
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
        }, true);
        const auctionCreateResult = await CollectorUtils.collectByModal(auctionCreatePrompt, new ModalBuilder({
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
                        },
                    ],
                },
            ],
        }), async (modalSubmitInteraction) => {
            return await auctionRetriver(modalSubmitInteraction);
        });
        await InteractionUtils.send(auctionCreateResult.intr, `yes`, true);
    }
}
async function auctionRetriver(intr) {
    const auctionName = intr.components[0].components[0];
    const bidders = intr.components[1].components[0];
    if (auctionName.type !== ComponentType.TextInput || bidders.type !== ComponentType.TextInput) {
        return;
    }
    // clean up names
    return {
        intr: intr,
        value: {
            name: 'au',
            bidders: ['dd', 'ff'],
        },
    };
}
//# sourceMappingURL=auction-setup.js.map