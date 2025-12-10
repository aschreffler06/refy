import { EmbedBuilder } from 'discord.js';
import { OsuMode } from '../enums/index.js';
import { Player } from '../models/database/index.js';
export class PpLeaderboardUtils {
    /**
     * Function to create a consistent score embed
     * @param player
     * @param score
     * @returns
     */
    static async createScoreEmbed(player, score, leaderboard, oldPp, newPp) {
        // look for the score in the leaderboard and grab index
        const scoreNumber = leaderboard.scores
            .filter(s => s.teamName === score.teamName)
            .sort((a, b) => b.pp - a.pp)
            .findIndex(s => s._id === score._id) + 1;
        // Get active status and highest score info for this beatmap set
        const activeStatus = score.isActive ? '🟢 Active' : '🔴 Inactive';
        // Find highest score on this beatmap set (any team/player)
        const beatmapSetScores = leaderboard.scores
            .filter(s => s.beatmapSetId === score.beatmapSetId)
            .sort((a, b) => b.pp - a.pp);
        const highestScore = beatmapSetScores[0];
        const highestActiveScore = beatmapSetScores.find(s => s.isActive);
        let scoreEmbed = new EmbedBuilder()
            .setTitle(`Score #${scoreNumber} | ${activeStatus}`)
            .setAuthor({
            name: `${player.username} | ${score.teamName} ${leaderboard.lowerRank} - ${leaderboard.upperRank} | ${leaderboard.mode}`,
            iconURL: player.avatar,
            url: `https://osu.ppy.sh/users/${player._id}`,
        });
        if (oldPp && newPp) {
            scoreEmbed.setTitle(`Score #${scoreNumber} | ${activeStatus} | ${oldPp.toFixed(2)}pp -> ${newPp.toFixed(2)}pp`);
        }
        const mods = score.mods.length > 0 ? score.mods.join('') : 'NM';
        scoreEmbed
            .addFields({
            name: `${score.title} [${score.version}] [${score.difficulty.toFixed(2)}*] +**${mods}**`,
            value: `${score.pp.toFixed(2)}pp | ${(score.accuracy * 100).toFixed(2)}% (**${score.maxCombo}**x/${score.beatmapMaxCombo}x) | ${score.score.toLocaleString()}`,
        })
            .setThumbnail(score.list);
        // Add beatmap set information (only if this isn't the highest score)
        if (highestScore && highestScore !== score) {
            const highestPlayer = await Player.findById(highestScore.userId).exec();
            let beatmapInfo = `**Beatmap Set Leader:** ${highestPlayer?.username || 'Unknown'} (${highestScore.teamName}) - ${highestScore.pp.toFixed(2)}pp on [${highestScore.version}]`;
            if (highestActiveScore && highestActiveScore !== highestScore) {
                const activePlayer = await Player.findById(highestActiveScore.userId).exec();
                beatmapInfo += `\n**Currently Active:** ${activePlayer?.username || 'Unknown'} (${highestActiveScore.teamName}) - ${highestActiveScore.pp.toFixed(2)}pp on [${highestActiveScore.version}]`;
                if (highestActiveScore.teamName === highestScore.teamName &&
                    highestActiveScore.userId !== highestScore.userId) {
                    beatmapInfo += ` *(teammate's higher score inactive)*`;
                }
            }
            else if (highestActiveScore === highestScore) {
                beatmapInfo += ` *(active)*`;
            }
            scoreEmbed.addFields({
                name: 'Beatmap Set Status',
                value: beatmapInfo,
                inline: false,
            });
        }
        else if (highestScore === score && !score.isActive) {
            // Special case: this player has the highest score but it's inactive
            scoreEmbed.addFields({
                name: 'Beatmap Set Status',
                value: `**You have the highest score on this beatmap set** *(but it's inactive due to player limits)*`,
                inline: false,
            });
        }
        return scoreEmbed;
    }
    static getPlayerLeaderboard(player, leaderboards, mode = OsuMode.STANDARD) {
        let lb;
        // find which rank range the player is in
        for (let i = 0; i < leaderboards.length; i++) {
            const leaderboard = leaderboards[i];
            if (mode === leaderboard.mode &&
                player.rank >= leaderboard.lowerRank &&
                player.rank <= leaderboard.upperRank) {
                lb = leaderboard;
            }
        }
        return lb;
    }
    static getScoreOnLeaderboard(leaderboard, id) {
        // Find the highest pp active score on this beatmap set
        const beatmapSetScores = leaderboard.scores
            .filter(s => s.beatmapSetId === id.toString() && s.isActive)
            .sort((a, b) => b.pp - a.pp);
        return beatmapSetScores.length > 0 ? beatmapSetScores[0] : null;
    }
}
//# sourceMappingURL=pp-leaderboard-utils.js.map