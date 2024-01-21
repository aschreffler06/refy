import { ChatInputCommandInteraction, PermissionsString } from 'discord.js';
import { RateLimiter } from 'discord.js-rate-limiter';

// import { OsuController } from '../../controllers/osu-controller.js';
import { Player, PpMatch } from '../../models/database/index.js';
import { Language } from '../../models/enum-helpers/index.js';
import { EventData } from '../../models/internal-models.js';
import { Lang } from '../../services/index.js';
import { InteractionUtils, PpLeaderboardUtils } from '../../utils/index.js';
import { Command, CommandDeferType } from '../index.js';

export class PpDisplayCommand implements Command {
    public names = [Lang.getRef('chatCommands.ppDisplay', Language.Default)];
    public cooldown = new RateLimiter(1, 5000);
    public deferType = CommandDeferType.PUBLIC;
    public requireClientPerms: PermissionsString[] = [];

    public async execute(intr: ChatInputCommandInteraction, _data: EventData): Promise<void> {
        // const args = {
        //     showAll: intr.options.getBoolean(Lang.getRef('arguments.showAll', _data.lang)),
        // }

        const match = await PpMatch.findOne({ guildId: intr.guildId });
        const player = await Player.findOne({ discord: intr.user.id }).exec();
        const leaderboards = match.leaderboards;
        const currentLeaderboard = PpLeaderboardUtils.getPlayerLeaderboard(player, leaderboards);

        // if (showAll) {
        //     for (const leaderboard of leaderboards) {

        //     }
        // }

        // make a map with the team names as the keys and the pp of the plays as the values
        const teamMap = new Map<string, number[]>();
        for (const team of match.teams) {
            teamMap.set(team.name, []);
        }

        // add the pp of the plays to the map
        for (const score of currentLeaderboard.scores) {
            teamMap.get(score.teamName).push(score.pp);
        }

        // get the total pp for each team
        const teamPpMap = new Map<string, number>();
        for (const [teamName, scores] of teamMap) {
            scores.sort((a, b) => b - a);
            let teamPp = 0;
            for (let i = 0; i < 100 && i < scores.length; i++) {
                teamPp += scores[i] * Math.pow(0.95, i);
            }
            teamPpMap.set(teamName, teamPp);
        }

        let teamsString = `Range: ${currentLeaderboard.lowerRank} - ${currentLeaderboard.upperRank}\n\n`;

        for (const [teamName, pp] of teamPpMap) {
            teamsString += `${teamName}: **${pp.toFixed(2)}** pp\n`;
        }
        await InteractionUtils.send(intr, teamsString);

        // let team1Pp = 0;
        // let team2Pp = 0;
        // for (let i = 0; i < team1Scores.length; i++) {
        //     team1Pp += team1Scores[i].pp * Math.pow(0.95, i);
        // }
        // for (let i = 0; i < team2Scores.length; i++) {
        //     team2Pp += team2Scores[i].pp * Math.pow(0.95, i);
        // }
        // if (showAll) {
        //     //create a map of the ids to the username to scores
        //     const idToName = new Map<string, string>();
        //     const osuController = new OsuController();
        //     for (const player of match.team1.players) {
        //         idToName.set(
        //             player._id.toString(),
        //             (await osuController.getUser({ id: player._id.toString() })).username
        //         );
        //     }
        //     for (const player of match.team2.players) {
        //         idToName.set(
        //             player._id.toString(),
        //             (await osuController.getUser({ id: player._id.toString() })).username
        //         );
        //     }

        //     // make an embed with the top 10 plays of each team
        //     const numPlays = 25;
        //     const team1PlaysEmbed = new EmbedBuilder().setTitle(
        //         `Top ${numPlays} Plays For ${match.team1.name} (${team1Pp.toFixed(2)} total pp)`
        //     );
        //     for (let i = 0; i < numPlays; i++) {
        //         const score = team1Scores[i];
        //         const mods = score.mods.length > 0 ? score.mods.join('') : 'NM';
        //         team1PlaysEmbed.addFields({
        //             name: `${i + 1}. ${idToName.get(score.userId)}`,
        //             value: `${score.pp.toFixed(2)} pp on ${score.title} [${
        //                 score.version
        //             }] +${mods} (${(score.accuracy * 100).toFixed(2)})%`,
        //         });
        //     }

        //     const team2PlaysEmbed = new EmbedBuilder().setTitle(
        //         `Top ${numPlays} Plays For ${match.team2.name} (${team2Pp.toFixed(2)} total pp))`
        //     );
        //     for (let i = 0; i < numPlays; i++) {
        //         const score = team2Scores[i];
        //         const mods = score.mods.length > 0 ? score.mods.join('') : 'NM';
        //         team2PlaysEmbed.addFields({
        //             name: `${i + 1}. ${idToName.get(score.userId)}`,
        //             value: `${score.pp.toFixed(2)} pp on ${score.title} [${
        //                 score.version
        //             }] +${mods} (${(score.accuracy * 100).toFixed(2)})%`,
        //         });
        //     }

        //     //get the top 3 contributers for each team using a map of the id to the total pp value and then print using the username
        //     const team1Contributers = new Map<string, number>();
        //     const team2Contributers = new Map<string, number>();
        //     for (let i = 0; i < team1Scores.length; i++) {
        //         const score = team1Scores[i];
        //         team1Contributers.set(
        //             score.userId,
        //             team1Contributers.get(score.userId) != null
        //                 ? team1Contributers.get(score.userId) + score.pp * Math.pow(0.95, i)
        //                 : score.pp * Math.pow(0.95, i)
        //         );
        //     }

        //     for (let i = 0; i < team2Scores.length; i++) {
        //         const score = team2Scores[i];
        //         team2Contributers.set(
        //             score.userId,
        //             team2Contributers.get(score.userId) != null
        //                 ? team2Contributers.get(score.userId) + score.pp * Math.pow(0.95, i)
        //                 : score.pp * Math.pow(0.95, i)
        //         );
        //     }

        //     //sort contributers by pp
        //     const team1ContributersSorted = new Map(
        //         [...team1Contributers.entries()].sort((a, b) => b[1] - a[1])
        //     );
        //     const team2ContributersSorted = new Map(
        //         [...team2Contributers.entries()].sort((a, b) => b[1] - a[1])
        //     );

        //     //make embeds for the top 5 contributers for each side

        //     const team1ContributersEmbed = new EmbedBuilder().setTitle(
        //         `Top 5 Contributers For ${match.team1.name}`
        //     );
        //     let i = 0;
        //     for (const [id, pp] of team1ContributersSorted) {
        //         if (i >= 5) break;
        //         team1ContributersEmbed.addFields({
        //             name: `${i + 1}. ${idToName.get(id)}`,
        //             value: `${pp.toFixed(2)} pp contributed to total`,
        //         });
        //         i++;
        //     }

        //     const team2ContributersEmbed = new EmbedBuilder().setTitle(
        //         `Top 5 Contributers For ${match.team2.name}`
        //     );
        //     i = 0;
        //     for (const [id, pp] of team2ContributersSorted) {
        //         if (i >= 5) break;
        //         team2ContributersEmbed.addFields({
        //             name: `${i + 1}. ${idToName.get(id)}`,
        //             value: `${pp.toFixed(2)} pp contributed to total`,
        //         });
        //         i++;
        //     }

        //     await InteractionUtils.send(intr, {
        //         embeds: [
        //             team1ContributersEmbed,
        //             team1PlaysEmbed,
        //             team2ContributersEmbed,
        //             team2PlaysEmbed,
        //         ],
        //     });
        // } else {
        //     //send the pp for each team
        //     await InteractionUtils.send(
        //         intr,
        //         `${match.team1.name} has **${team1Pp.toFixed(2)}** pp\n${
        //             match.team2.name
        //         } has **${team2Pp.toFixed(2)}** pp`
        //     );
        // }

        // //add all the pp together for each team
    }
}
