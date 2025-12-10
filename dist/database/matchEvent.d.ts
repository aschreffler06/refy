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
import { Schema, Types } from 'mongoose';
import { IScore } from './index.js';
/**
 * MatchEvent covers picks, bans, protects, etc.
 * We will treat the properties of each event mutually exclusive from other event types.
 */
type IMatchEvent = {
    eventType: string;
    map: string;
    choosingTeam: Types.ObjectId;
    winningTeam: Types.ObjectId;
    team1Scores: IScore[];
    team2Scores: IScore[];
};
declare const matchEventSchema: Schema<IMatchEvent, import("mongoose").Model<IMatchEvent, any, any, any, import("mongoose").Document<unknown, any, IMatchEvent> & Omit<IMatchEvent & {
    _id: Types.ObjectId;
}, never>, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, IMatchEvent, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<IMatchEvent>> & Omit<import("mongoose").FlatRecord<IMatchEvent> & {
    _id: Types.ObjectId;
}, never>>;
declare const MatchEvent: import("mongoose").Model<IMatchEvent, {}, {}, {}, import("mongoose").Document<unknown, {}, IMatchEvent> & Omit<IMatchEvent & {
    _id: Types.ObjectId;
}, never>, Schema<IMatchEvent, import("mongoose").Model<IMatchEvent, any, any, any, import("mongoose").Document<unknown, any, IMatchEvent> & Omit<IMatchEvent & {
    _id: Types.ObjectId;
}, never>, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, IMatchEvent, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<IMatchEvent>> & Omit<import("mongoose").FlatRecord<IMatchEvent> & {
    _id: Types.ObjectId;
}, never>>>;
export { MatchEvent, matchEventSchema, IMatchEvent };
