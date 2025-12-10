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
import { IMatchEvent } from './index.js';
type IMatchHistory = {
    mpLink: string;
    events: IMatchEvent[];
    winner: Types.ObjectId;
};
declare const matchHistorySchema: Schema<IMatchHistory, import("mongoose").Model<IMatchHistory, any, any, any, import("mongoose").Document<unknown, any, IMatchHistory> & Omit<IMatchHistory & {
    _id: Types.ObjectId;
}, never>, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, IMatchHistory, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<IMatchHistory>> & Omit<import("mongoose").FlatRecord<IMatchHistory> & {
    _id: Types.ObjectId;
}, never>>;
declare const MatchHistory: import("mongoose").Model<IMatchHistory, {}, {}, {}, import("mongoose").Document<unknown, {}, IMatchHistory> & Omit<IMatchHistory & {
    _id: Types.ObjectId;
}, never>, any>;
export { MatchHistory, IMatchHistory, matchHistorySchema };
