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
type IMap = {
    _id: number;
    mod: string[];
    slot: number;
    multiplier: number;
    comment: string;
};
declare const mapSchema: Schema<IMap, import("mongoose").Model<IMap, any, any, any, import("mongoose").Document<unknown, any, IMap> & Omit<IMap & Required<{
    _id: number;
}>, never>, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, IMap, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<IMap>> & Omit<import("mongoose").FlatRecord<IMap> & Required<{
    _id: number;
}>, never>>;
declare const Map: import("mongoose").Model<IMap, {}, {}, {}, import("mongoose").Document<unknown, {}, IMap> & Omit<IMap & Required<{
    _id: number;
}>, never>, Schema<IMap, import("mongoose").Model<IMap, any, any, any, import("mongoose").Document<unknown, any, IMap> & Omit<IMap & Required<{
    _id: number;
}>, never>, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, IMap, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<IMap>> & Omit<import("mongoose").FlatRecord<IMap> & Required<{
    _id: number;
}>, never>>>;
export { Map, mapSchema, IMap };
