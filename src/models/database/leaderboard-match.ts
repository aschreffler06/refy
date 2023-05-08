import { Model, model, Schema } from 'mongoose';

import { IPlayer, playerSchema } from './index.js';

// TEAMS
interface ILeaderboardTeam {
    name: string;
    players: IPlayer[];
}

type LeaderboardTeamDocumentProps = {
    players: IPlayer[];
};

const leaderboardTeamSchema = new Schema<ILeaderboardTeam, unknown, LeaderboardTeamDocumentProps>({
    name: { type: String, required: true },
    players: { type: [playerSchema], required: true },
});

// MATCHES
interface ILeaderboardMatch {
    name: string;
    guild_id: string;
    teams: ILeaderboardTeam[];
}

type LeaderboardMatchDocumentProps = {
    teams: ILeaderboardTeam[];
};

type LeaderboardMatchModelType = Model<ILeaderboardMatch, unknown, LeaderboardMatchDocumentProps>;

const leaderboardMatchSchema = new Schema<ILeaderboardMatch, LeaderboardMatchModelType>({
    name: { type: String, required: true },
    guild_id: { type: String, required: true },
    teams: { type: [leaderboardTeamSchema], required: true },
});

const LeaderboardMatch = model('LeaderboardMatch', leaderboardMatchSchema);

export { LeaderboardMatch };
