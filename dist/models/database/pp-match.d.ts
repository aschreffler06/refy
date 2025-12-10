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
import { IBounty } from './bounty.js';
import { IOsuScore, IPlayer } from './index.js';
import { MatchStatus, OsuMode } from '../../enums/index.js';
interface IPpTeam {
    name: string;
    players: IPlayer[];
}
interface IPpLeaderboard {
    lowerRank: number;
    upperRank: number;
    scores: IOsuScore[];
    mode: OsuMode;
}
interface IPpScoreLeaderboard {
    scores: IOsuScore[];
    mode: OsuMode;
}
interface IPpMatch {
    name: string;
    guildId: string;
    teams: IPpTeam[];
    leaderboards: IPpLeaderboard[];
    scoreLeaderboard: IPpScoreLeaderboard;
    bounties?: IBounty[];
    status: MatchStatus;
    updatesChannelId?: string;
}
type PpMatchDocumentProps = {
    teams: IPpTeam[];
    leaderboards: IPpLeaderboard[];
    scoreLeaderboard: IPpScoreLeaderboard;
    bounties?: IBounty[];
};
interface IPpMatchMethods {
    addTeam: (teamName: string) => void;
    addLeaderboard: (lowerRank: number, upperRank: number, mode: OsuMode) => void;
}
type PpMatchModel = Model<IPpMatch, unknown, IPpMatchMethods>;
type PpMatchModelType = Model<IPpMatch, unknown, PpMatchDocumentProps>;
declare const PpMatch: Model<IPpMatch, PpMatchModelType, IPpMatchMethods, {}, import("mongoose").Document<unknown, PpMatchModelType, IPpMatch> & Omit<IPpMatch & {
    _id: import("mongoose").Types.ObjectId;
}, keyof IPpMatchMethods> & IPpMatchMethods, Schema<IPpMatch, PpMatchModel, IPpMatchMethods, PpMatchModelType, {}, {}, import("mongoose").DefaultSchemaOptions, IPpMatch, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<IPpMatch>> & Omit<import("mongoose").FlatRecord<IPpMatch> & {
    _id: import("mongoose").Types.ObjectId;
}, keyof IPpMatchMethods> & IPpMatchMethods>>;
export { PpMatch, IPpMatch, IPpLeaderboard };
