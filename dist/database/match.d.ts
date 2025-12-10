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
type IMatch = {
    _id: number;
    team1: Types.ObjectId;
    team2: Types.ObjectId;
    time: number;
    pool: Types.ObjectId;
    state: string;
};
declare const matchSchema: Schema<IMatch, import("mongoose").Model<IMatch, any, any, any, import("mongoose").Document<unknown, any, IMatch> & Omit<IMatch & Required<{
    _id: number;
}>, never>, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, IMatch, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<IMatch>> & Omit<import("mongoose").FlatRecord<IMatch> & Required<{
    _id: number;
}>, never>>;
declare const Match: import("mongoose").Model<IMatch, {}, {}, {}, import("mongoose").Document<unknown, {}, IMatch> & Omit<IMatch & Required<{
    _id: number;
}>, never>, any>;
export { Match, matchSchema, IMatch };
