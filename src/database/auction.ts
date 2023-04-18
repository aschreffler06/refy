import { model, Schema } from 'mongoose';

type IAuction = {
    guild_id: string;
    name: string;
    bidders: string[];
};

const auctionSchema = new Schema<IAuction>({
    guild_id: { type: String, required: true },
    name: { type: String, required: true },
    bidders: { type: [String], required: true },
});

const Auction = model('Auction', auctionSchema);

export { Auction };
