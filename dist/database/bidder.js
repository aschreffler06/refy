import { model, Schema } from 'mongoose';
const bidderSchema = new Schema({
    _id: { type: String, required: true },
    cash: { type: Number, required: true },
    items: { type: [String], required: true },
});
const Bidder = model('Bidder', bidderSchema);
export { Bidder, bidderSchema };
//# sourceMappingURL=bidder.js.map