/// <reference types="mongoose/types/aggregate.js" />
/// <reference types="mongoose/types/callback.js" />
/// <reference types="mongoose/types/collection.js" />
/// <reference types="mongoose/types/connection.js" />
/// <reference types="mongoose/types/cursor.js" />
/// <reference types="mongoose/types/document.js" />
/// <reference types="mongoose/types/error.js" />
/// <reference types="mongoose/types/expressions.js" />
/// <reference types="mongoose/types/helpers.js" />
/// <reference types="mongoose/types/middlewares.js" />
/// <reference types="mongoose/types/indexes.js" />
/// <reference types="mongoose/types/models.js" />
/// <reference types="mongoose/types/mongooseoptions.js" />
/// <reference types="mongoose/types/pipelinestage.js" />
/// <reference types="mongoose/types/populate.js" />
/// <reference types="mongoose/types/query.js" />
/// <reference types="mongoose/types/schemaoptions.js" />
/// <reference types="mongoose/types/schematypes.js" />
/// <reference types="mongoose/types/session.js" />
/// <reference types="mongoose/types/types.js" />
/// <reference types="mongoose/types/utility.js" />
/// <reference types="mongoose/types/validation.js" />
/// <reference types="mongoose/types/virtuals.js" />
/// <reference types="mongoose/types/inferschematype.js" />
import { Model, Schema } from 'mongoose';
import { IPlayer } from './index.js';
interface ILeaderboardTeam {
    name: string;
    players: IPlayer[];
}
interface ILeaderboardMatch {
    name: string;
    guild_id: string;
    team1: ILeaderboardTeam;
    team2: ILeaderboardTeam;
}
type LeaderboardMatchDocumentProps = {
    team1: ILeaderboardTeam;
    team2: ILeaderboardTeam;
};
type LeaderboardMatchModelType = Model<ILeaderboardMatch, unknown, LeaderboardMatchDocumentProps>;
declare const LeaderboardMatch: Model<ILeaderboardMatch, {}, {}, {}, import("mongoose").Document<unknown, {}, ILeaderboardMatch> & Omit<ILeaderboardMatch & {
    _id: import("mongoose").Types.ObjectId;
}, never>, Schema<ILeaderboardMatch, LeaderboardMatchModelType, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, ILeaderboardMatch, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<ILeaderboardMatch>> & Omit<import("mongoose").FlatRecord<ILeaderboardMatch> & {
    _id: import("mongoose").Types.ObjectId;
}, never>>>;
export { LeaderboardMatch };
