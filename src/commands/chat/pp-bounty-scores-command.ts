import { ChatInputCommandInteraction, EmbedBuilder, PermissionsString } from 'discord.js';
import { RateLimiter } from 'discord.js-rate-limiter';

import { BountyWinCondition, MatchStatus } from '../../enums/index.js';
import { Player, PpMatch } from '../../models/database/index.js';
import { Language } from '../../models/enum-helpers/index.js';
import { EventData } from '../../models/internal-models.js';
import { Lang } from '../../services/index.js';
import { InteractionUtils } from '../../utils/index.js';
import { Command, CommandDeferType } from '../index.js';

export class PpBountyScoresCommand implements Command {
    public names = [Lang.getRef('chatCommands.ppBountyScores', Language.Default)];
    public cooldown = new RateLimiter(1, 5000);
    public deferType = CommandDeferType.PUBLIC;
    public requireClientPerms: PermissionsString[] = [];

    public async execute(intr: ChatInputCommandInteraction, data: EventData): Promise<void> {
        const args = {
            mapId: intr.options.getString(Lang.getRef('arguments.mapId', data.lang)),
        };

        // Get the active match for this guild
        const match = await PpMatch.findOne({
            guildId: intr.guildId,
            status: MatchStatus.ACTIVE,
        }).exec();

        if (!match) {
            await InteractionUtils.send(
                intr,
                'There is no active match in progress for this server!'
            );
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
            .addFields(
                {
                    name: 'Win Condition',
                    value: bounty.winCondition,
                    inline: true,
                },
                {
                    name: 'Mod',
                    value: bounty.mod,
                    inline: true,
                },
                {
                    name: 'Status',
                    value: bounty.isActive ? '🟢 Active' : '🔴 Inactive',
                    inline: true,
                }
            );

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

        // Calculate team scores
        const teamScores = new Map<string, number>();

        // Points mapping: 1st=15, 2nd=12, 3rd=10, 4th=8, then decrease by 1 until 12th=0
        const pointsMap = new Map<number, number>([
            [1, 15],
            [2, 12],
            [3, 10],
            [4, 8],
            [5, 7],
            [6, 6],
            [7, 5],
            [8, 4],
            [9, 3],
            [10, 2],
            [11, 1],
            [12, 0],
        ]);

        // Award points based on position in the scores array (already sorted)
        for (let i = 0; i < scores.length; i++) {
            const score = scores[i];
            if (score.teamName) {
                const points = pointsMap.get(i + 1) ?? 0; // Default to 0 for positions beyond 12th
                const currentPoints = teamScores.get(score.teamName) || 0;
                teamScores.set(score.teamName, currentPoints + points);
            }
        }

        // Find winning team
        let winningTeam: string | null = null;
        let maxPoints = -1;
        for (const [team, points] of teamScores.entries()) {
            if (points > maxPoints) {
                maxPoints = points;
                winningTeam = team;
            }
        }

        // Update bounty with winning team
        if (winningTeam) {
            bounty.winningTeam = winningTeam;
            await match.save();
        }

        // Add team scores to embed
        if (teamScores.size > 0) {
            let teamScoresText = '';
            const sortedTeams = Array.from(teamScores.entries()).sort((a, b) => b[1] - a[1]);
            for (const [team, points] of sortedTeams) {
                teamScoresText += `${team}: ${points} points\n`;
            }
            embed.addFields({
                name: 'Team Scores',
                value: teamScoresText,
                inline: false,
            });
        }

        if (bounty.winningTeam) {
            embed.setFooter({ text: `Winning Team: ${bounty.winningTeam} 🏆` });
        }

        await InteractionUtils.send(intr, { embeds: [embed] });
    }
}
