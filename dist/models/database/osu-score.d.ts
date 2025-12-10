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
import { OsuMod, OsuMode, OsuRank } from '../../enums/index.js';
interface IOsuScore {
    _id: string;
    userId: string;
    accuracy: number;
    count300: number;
    count100: number;
    count50: number;
    countMiss: number;
    maxCombo: number;
    beatmapMaxCombo: number;
    difficulty: number;
    pp: number;
    rank: OsuRank;
    score: number;
    mods: OsuMod[];
    created_at: number;
    mode: OsuMode;
    passed: boolean;
    beatmapSetId: string;
    beatmapId: string;
    status: string;
    title: string;
    version: string;
    url: string;
    list: string;
    teamName: string;
    isActive: boolean;
}
declare const osuScoreSchema: Schema<IOsuScore, import("mongoose").Model<IOsuScore, any, any, any, import("mongoose").Document<unknown, any, IOsuScore> & IOsuScore & Required<{
    _id: string;
}>, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, IOsuScore, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<IOsuScore>> & import("mongoose").FlatRecord<IOsuScore> & Required<{
    _id: string;
}>>;
declare const OsuScore: import("mongoose").Model<IOsuScore, {}, {}, {}, import("mongoose").Document<unknown, {}, IOsuScore> & IOsuScore & Required<{
    _id: string;
}>, Schema<IOsuScore, import("mongoose").Model<IOsuScore, any, any, any, import("mongoose").Document<unknown, any, IOsuScore> & IOsuScore & Required<{
    _id: string;
}>, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, IOsuScore, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<IOsuScore>> & import("mongoose").FlatRecord<IOsuScore> & Required<{
    _id: string;
}>>>;
export { OsuScore, IOsuScore, osuScoreSchema };
