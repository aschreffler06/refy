import { model, Schema } from 'mongoose';
const bidderSchema = new Schema({
    _id: { type: String, required: true },
    cash: { type: Number, required: true },
    items: { type: [String], required: true },
});
const auctionSchema = new Schema({
    guild_id: { type: String, required: true },
    name: { type: String, required: true },
    starting_cash: { type: Number, required: true },
    bidders: { type: [bidderSchema], required: true },
});
const Auction = model('Auction', auctionSchema);
export { Auction };
//# sourceMappingURL=auction.js.map