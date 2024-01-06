// This model is just for storing a single access token for use in the DB

import { Model, model, Schema } from 'mongoose';

interface IToken {
    _id: number;
    token: string;
    expirationTime: number;
}

interface ITokenMethods {
    isExpired: () => boolean;
}

type TokenModel = Model<IToken, unknown, ITokenMethods>;

const tokenSchema = new Schema<IToken, TokenModel, ITokenMethods>(
    {
        // overwrite the id to just be 1 for ease of access since this will be the only thing stored and the token itself changes
        _id: Number,
        token: String,
        // epoch time
        expirationTime: Number,
    },
    {
        collection: 'token',
    }
);

tokenSchema.method('isExpired', function isExpired(this: any): boolean {
    return this.expirationTime < Date.now() / 1000;
});

const Token = model('Token', tokenSchema);

export { Token };
