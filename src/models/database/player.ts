import { model, Schema } from 'mongoose';

interface IPlayer {
    _id: number;
    discord: string;
    rank: number;
    badges: number;
    accuracy: number;
    level: number;
    playCount: number;
    playTime: number;
    avatar: string;
}

const playerSchema = new Schema<IPlayer>({
    _id: { type: Number, required: true },
    discord: { type: String, required: true },
    rank: { type: Number, required: true },
    badges: { type: Number, required: true },
    accuracy: { type: Number, required: true },
    level: { type: Number, required: true },
    playCount: { type: Number, required: true },
    playTime: { type: Number, required: true },
    avatar: { type: String, required: true },
});

const Player = model('Player', playerSchema);

export { Player };
