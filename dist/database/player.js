import { model, Schema } from 'mongoose';
const playerSchema = new Schema({
    _id: { type: Number, required: true },
    discord: { type: String, required: true },
    rank: { type: Number, required: true },
    badges: { type: Number, required: true },
    // number relative to UTC
    timezone: { type: Number },
    country: { type: String },
});
const Player = model('Player', playerSchema);
export { Player, playerSchema };
//# sourceMappingURL=player.js.map