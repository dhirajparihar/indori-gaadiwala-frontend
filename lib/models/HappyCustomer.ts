import mongoose from 'mongoose';

const happyCustomerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    imageUrl: {
        type: String,
        required: true
    },
    vehicleName: {
        type: String,
        required: true,
        trim: true
    },
    review: {
        type: String,
        required: true,
        trim: true
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5,
        default: 5
    },
    deliveryDate: {
        type: String,
        trim: true
    }
}, {
    timestamps: true
});

const HappyCustomer = mongoose.models.HappyCustomer || mongoose.model('HappyCustomer', happyCustomerSchema);
export default HappyCustomer;
