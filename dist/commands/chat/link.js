// import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
// import { Player } from '../../models/database/index.js';
// import { OsuController } from '../../controllers/index.js';
// module.exports = {
//     data: new SlashCommandBuilder()
//         .setName('link')
//         .setDescription('Link your osu account with your name')
//         .addStringOption(option =>
//             option.setName('name').setDescription('Your osu! name').setRequired(true)
//         ),
//     async execute(interaction: ChatInputCommandInteraction) {
//         const osuName = interaction.options.getString('name');
//         // name is required in the command definition so we don't need to check for it but typescript is dumb
//         if (!osuName) {
//             return;
//         }
//         const osuUser = await getUserByName(osuName);
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
//# sourceMappingURL=link.js.map