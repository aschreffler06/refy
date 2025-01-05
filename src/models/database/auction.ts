import { Model, model, Schema, Types } from 'mongoose';

//BIDDERS
// For now, items will be discord ids of player that they bought
interface IBidder {
    _id: string;
    cash: number;
    items: string[];
}

interface IAuctionPlayer {
    _id: string;
    name: string;
    seed: number;
    rank: number;
    description: string;
    averageScore: number;
    bestMap: string;
    bestMapRank: string;
    bestMapScore: number;
    avatar: string;
}

const bidderSchema = new Schema<IBidder>({
    _id: { type: String, required: true },
    cash: { type: Number, required: true },
    items: { type: [String], required: true },
});

// PLAYERS
const auctionPlayerScehma = new Schema<IAuctionPlayer>({
    _id: { type: String, required: true },
    name: { type: String, required: true },
    seed: { type: Number, required: true },
    rank: { type: Number, required: true },
    description: { type: String, required: false },
    averageScore: { type: Number, required: true },
    bestMap: { type: String, required: true },
    bestMapRank: { type: String, required: true },
    bestMapScore: { type: Number, required: true },
    avatar: { type: String, required: true },
});

interface IAuction {
    guild_id: string;
    name: string;
    starting_cash: number;
    bidders: IBidder[];
    players: IAuctionPlayer[];
}

// AUCTIONS
type AuctionDocumentProps = {
    bidders: Types.DocumentArray<IBidder>;
    getCash: (id: string) => number;
    getAllCash: () => [string, number][];
    getItems: (id: string) => string[];
};

type AuctionModelType = Model<IAuction, unknown, AuctionDocumentProps>;

const auctionSchema = new Schema<IAuction, AuctionModelType, AuctionDocumentProps>({
    guild_id: { type: String, required: true },
    name: { type: String, required: true },
    starting_cash: { type: Number, required: true },
    bidders: { type: [bidderSchema], required: true },
    players: { type: [auctionPlayerScehma], required: false },
});

auctionSchema.method('getCash', function getCash(this: IAuction, id: string): number {
    const bidder = this.bidders.find(bidder => bidder._id === id);
    if (bidder) {
        return bidder.cash;
    } else {
        return 0;
    }
});

/**
 * Returns an array of tuples of the form [id, cash]
 */
auctionSchema.method('getAllCash', function getAllCash(this: IAuction): [string, number][] {
    return this.bidders.map(bidder => [bidder._id, bidder.cash]);
});

auctionSchema.method('getItems', function getItems(this: IAuction, id: string): string[] {
    const bidder = this.bidders.find(bidder => bidder._id === id);
    if (bidder && bidder.items.length > 0) {
        return bidder.items;
    } else {
        return [];
    }
});

auctionSchema.method('addPlayer', function addPlayer(this: IAuction, player: IAuctionPlayer): void {
    this.players.push(player);
});

const Auction = model('Auction', auctionSchema);

export { Auction };
