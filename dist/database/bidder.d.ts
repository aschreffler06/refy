/// <reference types="mongoose/types/aggregate" />
/// <reference types="mongoose/types/callback" />
/// <reference types="mongoose/types/collection" />
/// <reference types="mongoose/types/connection" />
/// <reference types="mongoose/types/cursor" />
/// <reference types="mongoose/types/document" />
/// <reference types="mongoose/types/error" />
/// <reference types="mongoose/types/expressions" />
/// <reference types="mongoose/types/helpers" />
/// <reference types="mongoose/types/middlewares" />
/// <reference types="mongoose/types/indexes" />
/// <reference types="mongoose/types/models" />
/// <reference types="mongoose/types/mongooseoptions" />
/// <reference types="mongoose/types/pipelinestage" />
/// <reference types="mongoose/types/populate" />
/// <reference types="mongoose/types/query" />
/// <reference types="mongoose/types/schemaoptions" />
/// <reference types="mongoose/types/schematypes" />
/// <reference types="mongoose/types/session" />
/// <reference types="mongoose/types/types" />
/// <reference types="mongoose/types/utility" />
/// <reference types="mongoose/types/validation" />
/// <reference types="mongoose/types/virtuals" />
/// <reference types="mongoose/types/inferschematype" />
import { Schema } from 'mongoose';
interface IBidder {
    _id: string;
    cash: number;
    items: string[];
}
declare const bidderSchema: Schema<IBidder, import("mongoose").Model<IBidder, any, any, any, import("mongoose").Document<unknown, any, IBidder> & Omit<IBidder & Required<{
    _id: string;
}>, never>, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, IBidder, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<IBidder>> & Omit<import("mongoose").FlatRecord<IBidder> & Required<{
    _id: string;
}>, never>>;
declare const Bidder: import("mongoose").Model<IBidder, {}, {}, {}, import("mongoose").Document<unknown, {}, IBidder> & Omit<IBidder & Required<{
    _id: string;
}>, never>, Schema<IBidder, import("mongoose").Model<IBidder, any, any, any, import("mongoose").Document<unknown, any, IBidder> & Omit<IBidder & Required<{
    _id: string;
}>, never>, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, IBidder, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<IBidder>> & Omit<import("mongoose").FlatRecord<IBidder> & Required<{
    _id: string;
}>, never>>>;
export { Bidder, IBidder, bidderSchema };
