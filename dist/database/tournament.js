import { model, Schema } from 'mongoose';
import { Constants } from './constants.js';
import { matchSchema, poolSchema, staffSchema, teamSchema, } from './index.js';
const tournamentSchema = new Schema({
    host: { type: String, required: true },
    name: { type: String, required: true },
    forumPost: { type: String, required: true },
    bracketLink: { type: String },
    acronym: { type: String, required: true },
    minTeamSize: { type: Number, required: true },
    maxTeamSize: { type: Number, required: true },
    format: {
        type: String,
        enum: Constants.FORMAT,
        default: '1v1',
        required: true,
    },
    // TODO: this is kind of broken i think
    bws: {
        type: Schema.Types.Mixed,
        default: (rank, badges) => {
            return rank ^ (0.9937 ^ (badges ^ 2));
        },
        required: true,
    },
    signups: { type: [teamSchema], default: [], required: true },
    numQualify: { type: Number, required: true },
    staff: { type: [staffSchema], default: [], required: true },
    pools: { type: [poolSchema], default: [], required: true },
    matchList: { type: [matchSchema], default: [], required: true },
    guildId: { type: String, required: true },
    state: {
        type: String,
        enum: Constants.TOURNEY_STATE,
        default: Constants.TOURNEY_STATE[0],
        required: true,
    },
    // TODO: (Bracket) Seeding information,
});
const Tournament = model('Tournament', tournamentSchema);
export { Tournament };
//# sourceMappingURL=tournament.js.map