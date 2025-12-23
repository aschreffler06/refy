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
interface IPlayer {
    _id: number;
    username: string;
    discord: string;
    rank: number;
    rankTaiko: number;
    rankCatch: number;
    rankMania: number;
    badges: number;
    accuracy: number;
    level: number;
    playCount: number;
    playTime: number;
    avatar: string;
    notifyOnSnipe?: boolean;
}
declare const playerSchema: Schema<IPlayer, import("mongoose").Model<IPlayer, any, any, any, import("mongoose").Document<unknown, any, IPlayer> & IPlayer & Required<{
    _id: number;
}>, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, IPlayer, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<IPlayer>> & import("mongoose").FlatRecord<IPlayer> & Required<{
    _id: number;
}>>;
declare const Player: import("mongoose").Model<IPlayer, {}, {}, {}, import("mongoose").Document<unknown, {}, IPlayer> & IPlayer & Required<{
    _id: number;
}>, Schema<IPlayer, import("mongoose").Model<IPlayer, any, any, any, import("mongoose").Document<unknown, any, IPlayer> & IPlayer & Required<{
    _id: number;
}>, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, IPlayer, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<IPlayer>> & import("mongoose").FlatRecord<IPlayer> & Required<{
    _id: number;
}>>>;
export { Player, IPlayer, playerSchema };
