import { EmbedBuilder } from 'discord.js';

import { IOsuScore, IPlayer, IPpLeaderboard } from '../models/database/index.js';

export class PpLeaderboardUtils {
    /**
     * Function to create a consistent score embed
     * @param player
     * @param score
     * @returns
     */
    public static createScoreEmbed(player: IPlayer, score: IOsuScore): EmbedBuilder {
        let scoreEmbed = new EmbedBuilder().setTitle('Score').setAuthor({
            name: player.username + ' | ' + score.teamName,
            iconURL: player.avatar,
            url: `https://osu.ppy.sh/users/${player._id}`,
        });

        const mods = score.mods.length > 0 ? score.mods.join('') : 'NM';
        if (mods.includes('EZ')) {
            if (mods.includes('DT') || mods.includes('NC')) {
                score.pp *= 1.25;
            } else {
                score.pp *= 1.5;
            }
        }

        scoreEmbed
            .addFields({
                name: `${score.title} [${score.version}] +**${mods}**`,
                value: `${score.pp.toFixed(2)} pp for ${(score.accuracy * 100).toFixed(2)}%`,
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
