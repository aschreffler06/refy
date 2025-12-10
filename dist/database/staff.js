import { model, Schema } from 'mongoose';
import { Constants } from './constants.js';
const staffSchema = new Schema({
    // osu! id
    _id: Number,
    role: {
        type: String,
        enum: Constants.STAFF_ROLES,
        required: true,
    },
});
const Staff = model('Staff', staffSchema);
export { Staff, staffSchema };
//# sourceMappingURL=staff.js.map