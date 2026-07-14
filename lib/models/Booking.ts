import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
    vehicle: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Vehicle',
        required: false
    },
    customerName: {
        type: String,
        required: true,
        trim: true
    },
    customerEmail: {
        type: String,
        required: false,
        lowercase: true,
        trim: true
    },
    customerPhone: {
        type: String,
        required: true,
        trim: true
    },
    message: {
        type: String,
        default: ''
    },
    offeredPrice: {
        type: Number,
        default: null
    },
    status: {
        type: String,
        enum: ['pending', 'contacted', 'completed', 'cancelled', 'inspection_scheduled'],
        default: 'pending'
    },
    preferredContactTime: {
        type: String,
        default: 'Anytime'
    },
    notes: {
        type: String,
        default: ''
    },
    bookingType: {
        type: String,
        enum: ['inquiry', 'test_drive', 'third_party_inspection'],
        default: 'inquiry'
    },
    preferredDate: {
        type: Date,
        default: null
    },
    preferredTimeSlot: {
        type: String,
        default: ''
    },
    externalVehicleDetails: {
        regNo: { type: String, default: '' },
        make: { type: String, default: '' },
        model: { type: String, default: '' }
    }
}, {
    timestamps: true
});

const Booking = mongoose.models.Booking || mongoose.model('Booking', bookingSchema);
export default Booking;
