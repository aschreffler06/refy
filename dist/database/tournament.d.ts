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
import { Schema } from 'mongoose';
import { IMatch, IPool, IStaff, ITeam } from './index.js';
type ITournament = {
    host: string;
    name: string;
    forumPost: string;
    bracketLink: string;
    acronym: string;
    minTeamSize: number;
    maxTeamSize: number;
    format: string;
    bws: Schema.Types.Mixed;
    signups: ITeam[];
    numQualify: number;
    staff: IStaff[];
    pools: IPool[];
    matchList: IMatch[];
    guildId: string;
    state: string;
};
declare const Tournament: import("mongoose").Model<ITournament, {}, {}, {}, import("mongoose").Document<unknown, {}, ITournament> & Omit<ITournament & {
    _id: import("mongoose").Types.ObjectId;
}, never>, Schema<ITournament, import("mongoose").Model<ITournament, any, any, any, import("mongoose").Document<unknown, any, ITournament> & Omit<ITournament & {
    _id: import("mongoose").Types.ObjectId;
}, never>, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, ITournament, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<ITournament>> & Omit<import("mongoose").FlatRecord<ITournament> & {
    _id: import("mongoose").Types.ObjectId;
}, never>>>;
export { Tournament };
