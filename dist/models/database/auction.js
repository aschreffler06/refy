import { model, Schema } from 'mongoose';
const bidderSchema = new Schema({
    _id: { type: String, required: true },
    cash: { type: Number, required: true },
    items: { type: [String], required: true },
});
// PLAYERS
const auctionPlayerScehma = new Schema({
    _id: { type: String, required: true },
    name: { type: String, required: true },
    seed: { type: Number, required: true },
    rank: { type: Number, required: true },
    description: { type: String, required: false },
    averageScore: { type: Number, required: true },
    bestMap: { type: String, required: true },
    bestMapRank: { type: String, required: true },
    bestMapScore: { type: Number, required: true },
    skillIssue: { type: Number, required: true },
    etx: { type: Number, required: true },
    avatar: { type: String, required: true },
});
const auctionSchema = new Schema({
    guild_id: { type: String, required: true },
    name: { type: String, required: true },
    starting_cash: { type: Number, required: true },
    bidders: { type: [bidderSchema], required: true },
    players: { type: [auctionPlayerScehma], required: false },
});
auctionSchema.method('getCash', function getCash(id) {
    const bidder = this.bidders.find(bidder => bidder._id === id);
    if (bidder) {
        return bidder.cash;
    }
    else {
        return 0;
    }
});
/**
 * Returns an array of tuples of the form [id, cash]
 */
auctionSchema.method('getAllCash', function getAllCash() {
    return this.bidders.map(bidder => [bidder._id, bidder.cash]);
});
auctionSchema.method('getItems', function getItems(id) {
    const bidder = this.bidders.find(bidder => bidder._id === id);
    if (bidder && bidder.items.length > 0) {
        return bidder.items;
    }
    else {
        return [];
    }
});
auctionSchema.method('addPlayer', function addPlayer(player) {
    this.players.push(player);
});
const Auction = model('Auction', auctionSchema);
export { Auction };
//# sourceMappingURL=auction.js.map