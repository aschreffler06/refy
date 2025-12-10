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
type IScore = {
    player: Types.ObjectId;
    score: number;
    mods: string[];
    maxCombo: number;
    accuracy: number;
    missCount: number;
};
declare const scoreSchema: Schema<IScore, import("mongoose").Model<IScore, any, any, any, import("mongoose").Document<unknown, any, IScore> & Omit<IScore & {
    _id: Types.ObjectId;
}, never>, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, IScore, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<IScore>> & Omit<import("mongoose").FlatRecord<IScore> & {
    _id: Types.ObjectId;
}, never>>;
declare const Score: import("mongoose").Model<IScore, {}, {}, {}, import("mongoose").Document<unknown, {}, IScore> & Omit<IScore & {
    _id: Types.ObjectId;
}, never>, Schema<IScore, import("mongoose").Model<IScore, any, any, any, import("mongoose").Document<unknown, any, IScore> & Omit<IScore & {
    _id: Types.ObjectId;
}, never>, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, IScore, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<IScore>> & Omit<import("mongoose").FlatRecord<IScore> & {
    _id: Types.ObjectId;
}, never>>>;
export { Score, scoreSchema, IScore };
