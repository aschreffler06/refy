import { model, Schema } from 'mongoose';

type IAuction = {
    name: string;
    bidders: string[];
};

const auctionSchema = new Schema<IAuction>({
    name: { type: String, required: true },
    bidders: { type: [String], required: true },
});

const Auction = model('Auction', auctionSchema);

export { Auction };
