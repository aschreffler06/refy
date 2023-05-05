import { Model, model, Schema, Types } from 'mongoose';

interface IAuction {
    guild_id: string;
    name: string;
    starting_cash: number;
    bidders: IBidder[];
}

// For now, items will be discord ids of player that they bought
interface IBidder {
    _id: string;
    cash: number;
    items: string[];
}

const bidderSchema = new Schema<IBidder>({
    _id: { type: String, required: true },
    cash: { type: Number, required: true },
    items: { type: [String], required: true },
});

type AuctionDocumentProps = {
    bidders: Types.DocumentArray<IBidder>;
};
type AuctionModelType = Model<IAuction, unknown, AuctionDocumentProps>;

const auctionSchema = new Schema<IAuction, AuctionModelType>({
    guild_id: { type: String, required: true },
    name: { type: String, required: true },
    starting_cash: { type: Number, required: true },
    bidders: { type: [bidderSchema], required: true },
});

const Auction = model('Auction', auctionSchema);

export { Auction };
