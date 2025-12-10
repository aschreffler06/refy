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
import { BountyWinCondition, OsuMod, OsuMode } from '../../enums/index.js';
interface IBounty {
    _id: string;
    isActive: boolean;
    winCondition: BountyWinCondition;
    value: number;
    beatmapId: string;
    lowerRank: number;
    upperRank: number;
    mod: OsuMod;
    mode: OsuMode;
    winningTeam: string | null;
}
declare const bountySchema: Schema<IBounty, import("mongoose").Model<IBounty, any, any, any, import("mongoose").Document<unknown, any, IBounty> & IBounty & Required<{
    _id: string;
}>, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, IBounty, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<IBounty>> & import("mongoose").FlatRecord<IBounty> & Required<{
    _id: string;
}>>;
declare const Bounty: import("mongoose").Model<IBounty, {}, {}, {}, import("mongoose").Document<unknown, {}, IBounty> & IBounty & Required<{
    _id: string;
}>, Schema<IBounty, import("mongoose").Model<IBounty, any, any, any, import("mongoose").Document<unknown, any, IBounty> & IBounty & Required<{
    _id: string;
}>, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, IBounty, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<IBounty>> & import("mongoose").FlatRecord<IBounty> & Required<{
    _id: string;
}>>>;
export { Bounty, IBounty, bountySchema };
