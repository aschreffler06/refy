import { model, Schema } from 'mongoose';

import { IPlayer, playerSchema } from './index.js';

type ITeam = {
    name: string;
    players: IPlayer[];
    timezone: string;
};

const teamSchema = new Schema<ITeam>({
    name: { type: String, required: true },
    players: { type: [playerSchema], required: true },
    timezone: { type: String, required: true },
});

const Team = model<ITeam>('Team', teamSchema);

export { Team, teamSchema, ITeam };
