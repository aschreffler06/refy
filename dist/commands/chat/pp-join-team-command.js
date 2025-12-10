import { RateLimiter } from 'discord.js-rate-limiter';
import { MatchStatus } from '../../enums/index.js';
import { Player, PpMatch } from '../../models/database/index.js';
import { Language } from '../../models/enum-helpers/index.js';
import { GoogleSheetsService, Lang } from '../../services/index.js';
import { InteractionUtils } from '../../utils/index.js';
import { CommandDeferType } from '../index.js';
export class PpJoinTeamCommand {
    constructor() {
        this.names = [Lang.getRef('chatCommands.ppJoinTeam', Language.Default)];
        this.cooldown = new RateLimiter(1, 5000);
        this.deferType = CommandDeferType.HIDDEN;
        this.requireClientPerms = [];
    }
    async execute(intr, data) {
        const args = {
            teamName: intr.options.getString(Lang.getRef('arguments.name', data.lang)),
        };
        // Map of Discord role IDs (preferred) or role names to match team names.
        // Update these values to match your server's role IDs or role names -> team mapping.
        const ROLE_TO_TEAM = {
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
        // Timezone mapping by state
        const STATE_TIMEZONE = {
            // Pacific Time (UTC-8)
            Alaska: 'UTC-9',
            California: 'UTC-8',
            Hawaii: 'UTC-10',
            Oregon: 'UTC-8',
            Washington: 'UTC-8',
            // Mountain Time (UTC-7)
            Arizona: 'UTC-7',
            Colorado: 'UTC-7',
            Idaho: 'UTC-7',
            'Missouri/Montana': 'UTC-7',
            Nevada: 'UTC-8',
            'New Mexico': 'UTC-7',
            Utah: 'UTC-7',
            Wyoming: 'UTC-7',
            // Central Time (UTC-6)
            Alabama: 'UTC-6',
            Arkansas: 'UTC-6',
            Illinois: 'UTC-6',
            Iowa: 'UTC-6',
            Kansas: 'UTC-6',
            Louisiana: 'UTC-6',
            Minnesota: 'UTC-6',
            Mississippi: 'UTC-6',
            Nebraska: 'UTC-6',
            'North Dakota': 'UTC-6',
            Oklahoma: 'UTC-6',
            'South Dakota': 'UTC-6',
            Tennessee: 'UTC-6',
            Texas: 'UTC-6',
            Wisconsin: 'UTC-6',
            // Eastern Time (UTC-5)
            Connecticut: 'UTC-5',
            Delaware: 'UTC-5',
            'Florida/Territories': 'UTC-5',
            Georgia: 'UTC-5',
            Indiana: 'UTC-5',
            Kentucky: 'UTC-5',
            Maine: 'UTC-5',
            Maryland: 'UTC-5',
            Massachusetts: 'UTC-5',
            Michigan: 'UTC-5',
            'New Hampshire': 'UTC-5',
            'New Jersey': 'UTC-5',
            'New York': 'UTC-5',
            'North Carolina': 'UTC-5',
            Ohio: 'UTC-5',
            Pennsylvania: 'UTC-5',
            'Rhode Island': 'UTC-5',
            'South Carolina': 'UTC-5',
            Vermont: 'UTC-5',
            Virginia: 'UTC-5',
            'West Virginia': 'UTC-5',
        };
        // Helper to decide team from member roles. Returns both team and state role name.
        const decideTeamFromRoles = (memberRoles) => {
            for (const r of memberRoles) {
                if (ROLE_TO_TEAM[r.name])
                    return { team: ROLE_TO_TEAM[r.name], stateRole: r.name };
            }
            return { team: null, stateRole: null };
        };
        const match = await PpMatch.findOne({
            guildId: intr.guildId,
            status: MatchStatus.ACTIVE,
        }).exec();
        if (!match) {
            await InteractionUtils.send(intr, `No active match is currently in progress for this server.`);
            return;
        }
        const player = await Player.findOne({ discord: intr.user.id }).exec();
        if (!player) {
            await InteractionUtils.send(intr, `You are not registered as a player. Please try running the /link command and try again.`);
            return;
        }
        for (const team of match.teams) {
            for (const player of team.players) {
                if (player.discord === intr.user.id) {
                    await InteractionUtils.send(intr, `You are already registered as a player in this match! Contact an admin if you need switched to a different team.`);
                    return;
                }
            }
        }
        // If no team name was provided, attempt to decide from the user's roles
        let targetTeamName = args.teamName;
        let inferredState = null;
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
            }
            catch (e) {
                await InteractionUtils.send(intr, {
                    content: 'Could not fetch your guild member information. Try again later.',
                    ephemeral: true,
                });
                return;
            }
            const result = decideTeamFromRoles(member.roles.cache.values());
            targetTeamName = result.team;
            inferredState = result.stateRole;
            if (!targetTeamName) {
                await InteractionUtils.send(intr, {
                    content: 'No matching role found to auto-assign you to a team. Please specify a team name.',
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
                            }
                            catch (e) {
                                // If role assignment fails, notify the user ephemeral
                                await InteractionUtils.send(intr, {
                                    content: `Joined team **${targetTeamName}**, but I couldn't assign the role.`,
                                    ephemeral: true,
                                });
                                return;
                            }
                        }
                    }
                    catch (e) {
                        // ignore member fetch errors and continue
                    }
                }
                // Append info to Google Sheets (timestamp, team name, player id, discord username, timezone, state)
                try {
                    const sheets = GoogleSheetsService.getInstance();
                    const timestamp = new Date().toISOString();
                    let state = inferredState;
                    // If state wasn't inferred earlier, try to get it from member roles now
                    if (!state && intr.guild) {
                        try {
                            const memberForState = await intr.guild.members.fetch(intr.user.id);
                            for (const r of memberForState.roles.cache.values()) {
                                if (ROLE_TO_TEAM[r.name] === team.name) {
                                    state = r.name;
                                    break;
                                }
                            }
                        }
                        catch (e) {
                            // ignore
                        }
                    }
                    const timezone = state ? STATE_TIMEZONE[state] ?? '' : '';
                    const row = [
                        [
                            timestamp,
                            String(player._id),
                            intr.user.username,
                            timezone,
                            state ?? '',
                            team.name,
                        ],
                    ];
                    await sheets.appendToSheet(row);
                }
                catch (e) {
                    // Don't block join on sheet errors; log for debugging
                    // eslint-disable-next-line no-console
                    console.error('Failed to append to Google Sheets on team join:', e);
                }
                await InteractionUtils.send(intr, {
                    content: `Joined team **${targetTeamName}**!`,
                    ephemeral: true,
                });
                return;
            }
        }
        await InteractionUtils.send(intr, `Could not find a team with the name **${targetTeamName}**. If you believe this is an error, contact an admin.`);
    }
}
//# sourceMappingURL=pp-join-team-command.js.map