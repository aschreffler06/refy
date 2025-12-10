import { model, Schema } from 'mongoose';
const playerSchema = new Schema({
    _id: { type: Number, required: true },
    username: { type: String, required: true },
    discord: { type: String, required: true },
    rank: { type: Number, required: true },
    badges: { type: Number, required: true },
    accuracy: { type: Number, required: true },
    level: { type: Number, required: true },
    playCount: { type: Number, required: true },
    playTime: { type: Number, required: true },
    avatar: { type: String, required: true },
    notifyOnSnipe: { type: Boolean, required: false, default: false },
});
const Player = model('Player', playerSchema);
export { Player, playerSchema };
//# sourceMappingURL=player.js.map