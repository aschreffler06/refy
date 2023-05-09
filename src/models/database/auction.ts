import { Model, model, Schema, Types } from 'mongoose';

//BIDDERS
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

interface IAuction {
    guild_id: string;
    name: string;
    starting_cash: number;
    bidders: IBidder[];
}

// AUCTIONS
type AuctionDocumentProps = {
    bidders: Types.DocumentArray<IBidder>;
    getCash: (id: string) => number;
    getItems: (id: string) => string[];
};

type AuctionModelType = Model<IAuction, unknown, AuctionDocumentProps>;

const auctionSchema = new Schema<IAuction, AuctionModelType, AuctionDocumentProps>({
    guild_id: { type: String, required: true },
    name: { type: String, required: true },
    starting_cash: { type: Number, required: true },
    bidders: { type: [bidderSchema], required: true },
});

auctionSchema.method('getCash', function getCash(this: IAuction, id: string): number {
    const bidder = this.bidders.find(bidder => bidder._id === id);
    if (bidder) {
        return bidder.cash;
    } else {
        return 0;
    }
});

auctionSchema.method('getItems', function getItems(this: IAuction, id: string): string[] {
    const bidder = this.bidders.find(bidder => bidder._id === id);
    if (bidder && bidder.items.length > 0) {
        return bidder.items;
    } else {
        return [];
    }
});

const Auction = model('Auction', auctionSchema);

export { Auction };
