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
import { Model, Schema, Types } from 'mongoose';
interface IBidder {
    _id: string;
    cash: number;
    items: string[];
}
interface IAuctionPlayer {
    _id: string;
    name: string;
    seed: number;
    rank: number;
    description: string;
    averageScore: number;
    bestMap: string;
    bestMapRank: string;
    bestMapScore: number;
    skillIssue: number;
    etx: number;
    avatar: string;
}
interface IAuction {
    guild_id: string;
    name: string;
    starting_cash: number;
    bidders: IBidder[];
    players: IAuctionPlayer[];
}
type AuctionDocumentProps = {
    bidders: Types.DocumentArray<IBidder>;
    getCash: (id: string) => number;
    getAllCash: () => [string, number][];
    getItems: (id: string) => string[];
};
type AuctionModelType = Model<IAuction, unknown, AuctionDocumentProps>;
declare const Auction: Model<IAuction, {}, AuctionDocumentProps, {}, import("mongoose").Document<unknown, {}, IAuction> & Omit<IAuction & {
    _id: Types.ObjectId;
}, keyof AuctionDocumentProps> & AuctionDocumentProps, Schema<IAuction, AuctionModelType, AuctionDocumentProps, {}, {}, {}, import("mongoose").DefaultSchemaOptions, IAuction, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<IAuction>> & Omit<import("mongoose").FlatRecord<IAuction> & {
    _id: Types.ObjectId;
}, keyof AuctionDocumentProps> & AuctionDocumentProps>>;
export { Auction };
