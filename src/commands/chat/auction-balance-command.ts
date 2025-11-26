import { ChatInputCommandInteraction, EmbedBuilder, PermissionsString } from 'discord.js';
import { RateLimiter } from 'discord.js-rate-limiter';

import { Auction } from '../../models/database/index.js';
import { Language } from '../../models/enum-helpers/index.js';
import { EventData } from '../../models/internal-models.js';
import { Lang } from '../../services/index.js';
import { InteractionUtils } from '../../utils/interaction-utils.js';
import { Command, CommandDeferType } from '../index.js';

export class AuctionBalanceCommand implements Command {
    public names = [Lang.getRef('chatCommands.auctionBalance', Language.Default)];
    public cooldown = new RateLimiter(1, 5000);
    public deferType = CommandDeferType.PUBLIC;
    public requireClientPerms: PermissionsString[] = [];

    public async execute(intr: ChatInputCommandInteraction, _data: EventData): Promise<void> {
        const args = {
            name: intr.options.getBoolean(Lang.getRef('arguments.showAll', Language.Default)),
        };
        const auction = await Auction.findOne({ guild_id: intr.guildId }).exec();
        let cashEmbed: EmbedBuilder;
        if (args.name) {
            const cashes = auction.getAllCash();
            let cashString = '';
            for (const user of cashes) {
                cashString += `<@${user[0]}>: ${user[1]}\n`;
            }
            cashEmbed = new EmbedBuilder()
                .setTitle(`Viewing All User's Cash`)
                .addFields({ name: 'Cash', value: cashString });
        } else {
            const cash = auction.getCash(intr.user.id);
            cashEmbed = new EmbedBuilder()
                .setTitle(`Viewing ${intr.user.username}'s Cash`)
                .addFields({ name: 'Cash', value: '$' + cash.toString() });
        }

        await InteractionUtils.send(intr, cashEmbed);
    }
}
