// This model is just for storing a single access token for use in the DB
import { model, Schema } from 'mongoose';
const tokenSchema = new Schema({
    // overwrite the id to just be 1 for ease of access since this will be the only thing stored and the token itself changes
    _id: Number,
    token: String,
    // epoch time
    expirationTime: Number,
}, {
    collection: 'token',
});
tokenSchema.method('isExpired', function isExpired() {
    return this.expirationTime < Date.now() / 1000;
});
const Token = model('Token', tokenSchema);
export { Token };
//# sourceMappingURL=token.js.map