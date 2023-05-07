import { ChatInputCommandInteraction, PermissionsString } from 'discord.js';
import { RateLimiter } from 'discord.js-rate-limiter';

import { OsuController } from '../../controllers/index.js';
import { OsuUserInfo } from '../../models/data-objects/index.js';
import { Language } from '../../models/enum-helpers/index.js';
import { EventData } from '../../models/internal-models.js';
import { Lang } from '../../services/index.js';
import { InteractionUtils } from '../../utils/index.js';
import { Command, CommandDeferType } from '../index.js';

export class LinkCommand implements Command {
    public names = [Lang.getRef('chatCommands.link', Language.Default)];
    public cooldown = new RateLimiter(1, 5000);
    public deferType = CommandDeferType.PUBLIC;
    public requireClientPerms: PermissionsString[] = [];

    public async execute(intr: ChatInputCommandInteraction, _data: EventData): Promise<void> {
        const args = {
            name: intr.options.getString(Lang.getRef('arguments.name', Language.Default)),
        };

        const osuController = new OsuController();
        const osuUser: OsuUserInfo = await osuController.getUser({
            username: args.name,
        });

        console.log(osuUser);

        await InteractionUtils.send(intr, `Name: ${args.name}`);
    }
}

// module.exports = {
//     data: new SlashCommandBuilder()
//         .setName('link')
//         .setDescription('Link your osu account with your name')
//         .addStringOption(option =>
//             option.setName('name').setDescription('Your osu! name').setRequired(true)
//         ),

//     async execute(interaction: ChatInputCommandInteraction) {
//         const osuController = new OsuController();
//         const osuName = interaction.options.getString('name');
//         // name is required in the command definition so we don't need to check for it but typescript is dumb
//         if (!osuName) {
//             return;
//         }
//         const osuUser = await osuController.getUser({ username: osuName });
//         if (!(osuUser.id == -1)) {
//             // Check if they are already in the DB. No multiaccounting so we assume that they are relinking to a new discord and will only cover that specific case
//             // This will also force an update to their rank and badge count
//             const user = await Player.findById(osuUser.id).exec();
//             // Put in DB
//             if (!user) {
//                 const player = new Player({
//                     _id: osuUser.id,
//                     discord: interaction.user.tag,
//                     rank: osuUser.rank,
//                     badges: osuUser.badges,
//                 });
//                 await player.save();
//                 await interaction.reply({
//                     content: 'You have successfully linked your account!',
//                     ephemeral: true,
//                 });
//                 // Update DB
//             } else {
//                 user.updateOne({
//                     discord: interaction.user.tag,
//                     rank: osuUser.rank,
//                     badges: osuUser.badges,
//                 }).exec();
//                 await user.save();
//                 await interaction.reply({
//                     content: 'You have successfully relinked your account!',
//                     ephemeral: true,
//                 });
//             }
//         } else {
//             await interaction.reply({
//                 content: 'There was an error. Please check that your name is inputted correctly.',
//                 ephemeral: true,
//             });
//         }
//         return;
//     },
// };
