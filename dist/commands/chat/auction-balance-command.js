import { EmbedBuilder } from 'discord.js';
import { RateLimiter } from 'discord.js-rate-limiter';
import { Auction } from '../../models/database/index.js';
import { Language } from '../../models/enum-helpers/index.js';
import { Lang } from '../../services/index.js';
import { InteractionUtils } from '../../utils/interaction-utils.js';
import { CommandDeferType } from '../index.js';
export class AuctionBalanceCommand {
    constructor() {
        this.names = [Lang.getRef('chatCommands.auctionBalance', Language.Default)];
        this.cooldown = new RateLimiter(1, 5000);
        this.deferType = CommandDeferType.PUBLIC;
        this.requireClientPerms = [];
    }
    async execute(intr, _data) {
        const args = {
            name: intr.options.getBoolean(Lang.getRef('arguments.showAll', Language.Default)),
        };
        const auction = await Auction.findOne({ guild_id: intr.guildId }).exec();
        let cashEmbed;
        if (args.name) {
            const cashes = auction.getAllCash();
            let cashString = '';
            for (const user of cashes) {
                cashString += `<@${user[0]}>: ${user[1]}\n`;
            }
            cashEmbed = new EmbedBuilder()
                .setTitle(`Viewing All User's Cash`)
                .addFields({ name: 'Cash', value: cashString });
        }
        else {
            const cash = auction.getCash(intr.user.id);
            cashEmbed = new EmbedBuilder()
                .setTitle(`Viewing ${intr.user.username}'s Cash`)
                .addFields({ name: 'Cash', value: '$' + cash.toString() });
        }
        await InteractionUtils.send(intr, cashEmbed);
    }
}
//# sourceMappingURL=auction-balance-command.js.map