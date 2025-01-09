import { EmbedBuilder } from 'discord.js';

import { IOsuScore, IPlayer, IPpLeaderboard } from '../models/database/index.js';

export class PpLeaderboardUtils {
    /**
     * Function to create a consistent score embed
     * @param player
     * @param score
     * @returns
     */
    public static createScoreEmbed(
        player: IPlayer,
        score: IOsuScore,
        leaderboard: IPpLeaderboard,
        oldPp?: number,
        newPp?: number
    ): EmbedBuilder {
        // look for the score in the leaderboard and grab index
        const scoreNumber =
            leaderboard.scores
                .filter(s => s.teamName === score.teamName)
                .sort((a, b) => b.pp - a.pp)
                .findIndex(s => s._id === score._id) + 1;

        let scoreEmbed = new EmbedBuilder().setTitle(`Score #${scoreNumber}`).setAuthor({
            name: `${player.username} | ${score.teamName} ${leaderboard.lowerRank} - ${leaderboard.upperRank}`,
            iconURL: player.avatar,
            url: `https://osu.ppy.sh/users/${player._id}`,
        });

        if (oldPp && newPp) {
            scoreEmbed.setTitle(
                `Score #${scoreNumber} | ${oldPp.toFixed(2)}pp -> ${newPp.toFixed(2)}pp`
            );
        }

        const mods = score.mods.length > 0 ? score.mods.join('') : 'NM';

        scoreEmbed
            .addFields({
                name: `${score.title} [${score.version}] [${score.difficulty.toFixed(
                    2
                )}*] +**${mods}**`,
                value: `${score.pp.toFixed(2)} pp for ${(score.accuracy * 100).toFixed(2)}% (**${
                    score.maxCombo
                }**x/${score.beatmapMaxCombo}x)`,
            })
            .setThumbnail(score.list);

        return scoreEmbed;
    }

    public static getPlayerLeaderboard(
        player: IPlayer,
        leaderboards: IPpLeaderboard[]
    ): IPpLeaderboard {
        let lb;

        // find which rank range the player is in
        for (let i = 0; i < leaderboards.length; i++) {
            const leaderboard = leaderboards[i];
            if (player.rank >= leaderboard.lowerRank && player.rank <= leaderboard.upperRank) {
                lb = leaderboard;
            }
        }

        return lb;
    }

    public static getMapOnLeaderbaord(leaderboard: IPpLeaderboard, id: string): IOsuScore {
        return leaderboard.scores.find(s => s.beatmapId === id.toString());
    }
}
