import { Model, model, Schema } from 'mongoose';

import { IOsuScore, IPlayer, osuScoreSchema, playerSchema } from './index.js';
import { MatchStatus, OsuMode } from '../../enums/index.js';

// TEAMS
interface IPpTeam {
    name: string;
    players: IPlayer[];
}

type PpTeamDocumentProps = {
    players: IPlayer[];
};

const ppTeamSchema = new Schema<IPpTeam, unknown, PpTeamDocumentProps>({
    name: { type: String, required: true },
    players: { type: [playerSchema], required: true },
});

//LEADERBOARDS
interface IPpLeaderboard {
    lowerRank: number;
    upperRank: number;
    //score tied with the team name who set it
    scores: IOsuScore[];
    mode: OsuMode;
}

type PpLeaderboardDocumentProps = {
    scores: [IOsuScore, string][];
};

const ppLeaderboardSchema = new Schema<IPpLeaderboard, unknown, PpLeaderboardDocumentProps>({
    lowerRank: { type: Number, required: true },
    upperRank: { type: Number, required: true },
    scores: { type: [osuScoreSchema], required: true },
    mode: { type: String, required: true, default: OsuMode.STANDARD },
});

// MATCHES
interface IPpMatch {
    name: string;
    guildId: string;
    teams: IPpTeam[];
    leaderboards: IPpLeaderboard[];
    status: MatchStatus;
}

type PpMatchDocumentProps = {
    teams: IPpTeam[];
    leaderboards: IPpLeaderboard[];
};

interface IPpMatchMethods {
    addTeam: (teamName: string) => void;
    addLeaderboard: (lowerRank: number, upperRank: number, mode: OsuMode) => void;
}

type PpMatchModel = Model<IPpMatch, unknown, IPpMatchMethods>;

type PpMatchModelType = Model<IPpMatch, unknown, PpMatchDocumentProps>;

const ppMatchSchema = new Schema<IPpMatch, PpMatchModel, IPpMatchMethods, PpMatchModelType>({
    name: { type: String, required: true },
    guildId: { type: String, required: true },
    teams: { type: [ppTeamSchema], required: true },
    leaderboards: { type: [ppLeaderboardSchema], required: true },
    status: { type: String, enum: Object.values(MatchStatus), default: MatchStatus.ACTIVE },
});

ppMatchSchema.method('addTeam', function addTeam(teamName: string) {
    this.teams.push({
        name: teamName,
        players: [],
    });
});

ppMatchSchema.method(
    'addLeaderboard',
    function addLeaderboard(
        lowerRank: number,
        upperRank: number,
        mode: OsuMode = OsuMode.STANDARD
    ) {
        this.leaderboards.push({
            lowerRank: lowerRank,
            upperRank: upperRank,
            scores: [],
            mode: mode,
        });
    }
);

const PpMatch = model('PpMatch', ppMatchSchema);

export { PpMatch, IPpMatch, IPpLeaderboard };
