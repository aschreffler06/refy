import { Model, model, Schema } from 'mongoose';

import { IPlayer, playerSchema } from './index.js';

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

// MATCHES
interface IPpMatch {
    name: string;
    guild_id: string;
    team1: IPpTeam;
    team2: IPpTeam;
}

type PpMatchDocumentProps = {
    team1: IPpTeam;
    team2: IPpTeam;
};

type PpMatchModelType = Model<IPpMatch, unknown, PpMatchDocumentProps>;

const ppMatchSchema = new Schema<IPpMatch, PpMatchModelType>({
    name: { type: String, required: true },
    guild_id: { type: String, required: true },
    team1: { type: ppTeamSchema, required: true },
    team2: { type: ppTeamSchema, required: true },
});

const PpMatch = model('PpMatch', ppMatchSchema);

export { PpMatch };
