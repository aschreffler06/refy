import { model, Schema } from 'mongoose';

interface IPlayer {
    _id: number;
    discord: string;
    rank: number;
    badges: number;
    timezone: number;
    country: string;
    avatar: string;
}

const playerSchema = new Schema<IPlayer>({
    _id: { type: Number, required: true },
    discord: { type: String, required: true },
    rank: { type: Number, required: true },
    badges: { type: Number, required: true },
    // number relative to UTC
    timezone: { type: Number },
    country: { type: String },
});

const Player = model('Player', playerSchema);

export { Player };
