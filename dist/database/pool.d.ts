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
import { IMap } from './index.js';
type IPool = {
    maps: IMap[];
    numMaps: number;
    round: string;
    targetSr: number;
};
declare const poolSchema: Schema<IPool, import("mongoose").Model<IPool, any, any, any, import("mongoose").Document<unknown, any, IPool> & Omit<IPool & {
    _id: import("mongoose").Types.ObjectId;
}, never>, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, IPool, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<IPool>> & Omit<import("mongoose").FlatRecord<IPool> & {
    _id: import("mongoose").Types.ObjectId;
}, never>>;
declare const Pool: import("mongoose").Model<IPool, {}, {}, {}, import("mongoose").Document<unknown, {}, IPool> & Omit<IPool & {
    _id: import("mongoose").Types.ObjectId;
}, never>, Schema<IPool, import("mongoose").Model<IPool, any, any, any, import("mongoose").Document<unknown, any, IPool> & Omit<IPool & {
    _id: import("mongoose").Types.ObjectId;
}, never>, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, IPool, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<IPool>> & Omit<import("mongoose").FlatRecord<IPool> & {
    _id: import("mongoose").Types.ObjectId;
}, never>>>;
export { Pool, poolSchema, IPool };
