import { ChatInputCommandInteraction, PermissionsString } from 'discord.js';
import { RateLimiter } from 'discord.js-rate-limiter';

import { MatchStatus } from '../../enums/index.js';
import { Player, PpMatch } from '../../models/database/index.js';
import { Language } from '../../models/enum-helpers/index.js';
import { EventData } from '../../models/internal-models.js';
import { Lang } from '../../services/index.js';
import { InteractionUtils } from '../../utils/index.js';
import { Command, CommandDeferType } from '../index.js';

export class PpJoinTeamCommand implements Command {
    public names = [Lang.getRef('chatCommands.ppJoinTeam', Language.Default)];
    public cooldown = new RateLimiter(1, 5000);
    public deferType = CommandDeferType.HIDDEN;
    public requireClientPerms: PermissionsString[] = [];

    public async execute(intr: ChatInputCommandInteraction, data: EventData): Promise<void> {
        const args = {
            teamName: intr.options.getString(Lang.getRef('arguments.name', data.lang)),
        };

        // Map of Discord role IDs (preferred) or role names to match team names.
        // Update these values to match your server's role IDs or role names -> team mapping.
        const ROLE_TO_TEAM: Record<string, string> = {
            // West
            Alaska: 'West',
            California: 'West',
            Hawaii: 'West',
            Oregon: 'West',
            Washington: 'West',

            // Central
            Arizona: 'Central',
            Colorado: 'Central',
            Idaho: 'Central',
            Illinois: 'Central',
            Iowa: 'Central',
            Kansas: 'Central',
            Minnesota: 'Central',
            'Missouri/Montana': 'Central',
            Nebraska: 'Central',
            Nevada: 'Central',
            'New Mexico': 'Central',
            'North Dakota': 'Central',
            Oklahoma: 'Central',
            'South Dakota': 'Central',
            Texas: 'Central',
            Utah: 'Central',
            Wisconsin: 'Central',
            Wyoming: 'Central',

            // South
            Alabama: 'South',
            Arkansas: 'South',
            'Florida/Territories': 'South',
            Georgia: 'South',
            Kentucky: 'South',
            Louisiana: 'South',
            Mississippi: 'South',
            'North Carolina': 'South',
            'South Carolina': 'South',
            Tennessee: 'South',
            Virginia: 'South',
            'West Virginia': 'South',

            // North
            Connecticut: 'North',
            Delaware: 'North',
            Indiana: 'North',
            Maine: 'North',
            Maryland: 'North',
            Massachusetts: 'North',
            Michigan: 'North',
            'New Hampshire': 'North',
            'New Jersey': 'North',
            'New York': 'North',
            Ohio: 'North',
            Pennsylvania: 'North',
            'Rhode Island': 'North',
            Vermont: 'North',
        };

        // Helper to decide team from member roles.
        const decideTeamFromRoles = (memberRoles: Iterable<any>): string | null => {
            for (const r of memberRoles) {
                if (ROLE_TO_TEAM[r.name]) return ROLE_TO_TEAM[r.name];
            }
            return null;
        };

        const match = await PpMatch.findOne({
            guildId: intr.guildId,
            status: MatchStatus.ACTIVE,
        }).exec();
        if (!match) {
            await InteractionUtils.send(
                intr,
                `No active match is currently in progress for this server.`
            );
            return;
        }

        const player = await Player.findOne({ discord: intr.user.id }).exec();
        if (!player) {
            await InteractionUtils.send(
                intr,
                `You are not registered as a player. Please try running the /link command and try again.`
            );
            return;
        }
        for (const team of match.teams) {
            for (const player of team.players) {
                if (player.discord === intr.user.id) {
                    await InteractionUtils.send(
                        intr,
                        `You are already registered as a player in this match! Contact an admin if you need switched to a different team.`
                    );
                    return;
                }
            }
        }
        // If no team name was provided, attempt to decide from the user's roles
        let targetTeamName = args.teamName;
        if (!targetTeamName) {
            // fetch the guild member to inspect roles (ensures up-to-date info)
            if (!intr.guild) {
                await InteractionUtils.send(intr, {
                    content: 'This command must be used in a server.',
                    ephemeral: true,
                });
                return;
            }

            let member;
            try {
                member = await intr.guild.members.fetch(intr.user.id);
            } catch (e) {
                await InteractionUtils.send(intr, {
                    content: 'Could not fetch your guild member information. Try again later.',
                    ephemeral: true,
                });
                return;
            }

            targetTeamName = decideTeamFromRoles(member.roles.cache.values());
            if (!targetTeamName) {
                await InteractionUtils.send(intr, {
                    content:
                        'No matching role found to auto-assign you to a team. Please specify a team name.',
                    ephemeral: true,
                });
                return;
            }
        }

        // Attempt to add player to the resolved team
        for (const team of match.teams) {
            if (team.name === targetTeamName) {
                team.players.push(player);
                await match.save();

                // Try to assign a Discord role matching the team name
                if (intr.guild) {
                    try {
                        const member = await intr.guild.members.fetch(intr.user.id);
                        // Find a role in the guild matching the team name
                        const role = intr.guild.roles.cache.find(r => r.name === team.name);
                        if (role) {
                            // Add the team role
                            try {
                                await member.roles.add(role.id);
                            } catch (e) {
                                // If role assignment fails, notify the user ephemeral
                                await InteractionUtils.send(intr, {
                                    content: `Joined team **${targetTeamName}**, but I couldn't assign the role.`,
                                    ephemeral: true,
                                });
                                return;
                            }
                        }
                    } catch (e) {
                        // ignore member fetch errors and continue
                    }
                }

                await InteractionUtils.send(intr, {
                    content: `Joined team **${targetTeamName}**!`,
                    ephemeral: true,
                });
                return;
            }
        }

        await InteractionUtils.send(
            intr,
            `Could not find a team with the name **${targetTeamName}**. If you believe this is an error, contact an admin.`
        );
    }
}
