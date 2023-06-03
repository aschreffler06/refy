import { Model, model, Schema } from 'mongoose';

import { IOsuScore, IPlayer, osuScoreSchema, playerSchema } from './index.js';

// TEAMS
interface IPpTeam {
    name: string;
    players: IPlayer[];
    scores: IOsuScore[];
}

type PpTeamDocumentProps = {
    players: IPlayer[];
    scores: IOsuScore[];
};

const ppTeamSchema = new Schema<IPpTeam, unknown, PpTeamDocumentProps>({
    name: { type: String, required: true },
    players: { type: [playerSchema], required: true },
    scores: { type: [osuScoreSchema], required: true },
});

// MATCHES
interface IPpMatch {
    name: string;
    guildId: string;
    team1: IPpTeam;
    team2: IPpTeam;
}

type PpMatchDocumentProps = {
    team1: IPpTeam;
    team2: IPpTeam;
};

interface IPpMatchMethods {
    createTeams: (team1Name: string, team2Name: string) => void;
}

type PpMatchModel = Model<IPpMatch, unknown, IPpMatchMethods>;

type PpMatchModelType = Model<IPpMatch, unknown, PpMatchDocumentProps>;

const ppMatchSchema = new Schema<IPpMatch, PpMatchModel, IPpMatchMethods, PpMatchModelType>({
    name: { type: String, required: true },
    guildId: { type: String, required: true },
    team1: { type: ppTeamSchema, required: true },
    team2: { type: ppTeamSchema, required: true },
});

ppMatchSchema.method('createTeams', function createTeams(team1Name: string, team2Name: string) {
    this.team1 = {
        name: team1Name,
        players: [],
        scores: [],
    };
    this.team2 = {
        name: team2Name,
        players: [],
        scores: [],
    };
});

const PpMatch = model('PpMatch', ppMatchSchema);

export { PpMatch };
