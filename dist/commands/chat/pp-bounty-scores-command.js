import { EmbedBuilder } from 'discord.js';
import { RateLimiter } from 'discord.js-rate-limiter';
import { BountyWinCondition, MatchStatus } from '../../enums/index.js';
import { Player, PpMatch } from '../../models/database/index.js';
import { Language } from '../../models/enum-helpers/index.js';
import { Lang } from '../../services/index.js';
import { InteractionUtils } from '../../utils/index.js';
import { CommandDeferType } from '../index.js';
export class PpBountyScoresCommand {
    constructor() {
        this.names = [Lang.getRef('chatCommands.ppBountyScores', Language.Default)];
        this.cooldown = new RateLimiter(1, 5000);
        this.deferType = CommandDeferType.PUBLIC;
        this.requireClientPerms = [];
    }
    async execute(intr, data) {
        const args = {
            mapId: intr.options.getString(Lang.getRef('arguments.mapId', data.lang)),
        };
        // Get the active match for this guild
        const match = await PpMatch.findOne({
            guildId: intr.guildId,
            status: MatchStatus.ACTIVE,
        }).exec();
        if (!match) {
            await InteractionUtils.send(intr, 'There is no active match in progress for this server!');
            return;
        }
        // Find the bounty for this beatmap
        const bounty = match.bounties.find(b => b.beatmapId === args.mapId);
        if (!bounty) {
            await InteractionUtils.send(intr, 'No bounty found for this beatmap!');
            return;
        }
        const scores = bounty.scores;
        if (!scores || scores.length === 0) {
            await InteractionUtils.send(intr, 'No scores have been submitted for this bounty yet!');
            return;
        }
        // Create embed
        const embed = new EmbedBuilder()
            .setTitle(`Bounty Scores - ${bounty.beatmapId}`)
            .setColor('#FF69B4')
            .addFields({
            name: 'Win Condition',
            value: bounty.winCondition,
            inline: true,
        }, {
            name: 'Mod',
            value: bounty.mod,
            inline: true,
        }, {
            name: 'Status',
            value: bounty.isActive ? '🟢 Active' : '🔴 Inactive',
            inline: true,
        });
        // Build leaderboard string
        let leaderboardText = '';
        for (let i = 0; i < Math.min(scores.length, 11); i++) {
            const score = scores[i];
            const player = await Player.findById(score.userId).exec();
            const username = player?.username || 'Unknown';
            let scoreValue = '';
            switch (bounty.winCondition) {
                case BountyWinCondition.ACCURACY:
                    scoreValue = `${(score.accuracy * 100).toFixed(2)}%`;
                    break;
                case BountyWinCondition.SCORE:
                    scoreValue = score.score?.toLocaleString() || '0';
                    break;
                case BountyWinCondition.MISS_COUNT:
                    scoreValue = `${score.countMiss}x miss`;
                    break;
                case BountyWinCondition.COMBO:
                    scoreValue = `${score.maxCombo}x`;
                    break;
                case BountyWinCondition.PASS:
                    scoreValue = score.passed ? '✅ Passed' : '❌ Failed';
                    break;
            }
            leaderboardText += `**${i + 1}.** ${username} - ${scoreValue} | ${score.teamName}\n`;
        }
        embed.setDescription(leaderboardText || 'No scores yet!');
        if (bounty.winningTeam) {
            embed.setFooter({ text: `Winning Team: ${bounty.winningTeam}` });
        }
        await InteractionUtils.send(intr, { embeds: [embed] });
    }
}
//# sourceMappingURL=pp-bounty-scores-command.js.map