import mongoose from 'mongoose';

const vehicleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    enum: ['car', 'bike', 'commercial'],
    required: true
  },
  brand: {
    type: String,
    required: true,
    trim: true
  },
  model: {
    type: String,
    required: true,
    trim: true
  },
  year: {
    type: Number,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  originalPrice: {
    type: Number,
    required: true
  },
  discount: {
    type: Number,
    default: 0
  },
  mileage: {
    type: String,
    required: true
  },
  fuelType: {
    type: String,
    enum: ['Petrol', 'Diesel', 'Electric', 'Hybrid', 'CNG'],
    required: true
  },
  transmission: {
    type: String,
    enum: ['Manual', 'Automatic', 'Semi-Automatic'],
    required: true
  },
  description: {
    type: String,
    required: true
  },
  images: [{
    type: String
  }],
  features: [{
    type: String
  }],
  status: {
    type: String,
    enum: ['available', 'sold', 'reserved'],
    default: 'available',
    index: true
  },
  ownerCount: {
    type: Number,
    default: 1
  },
  location: {
    type: String,
    default: 'India'
  },
  featured: {
    type: Boolean,
    default: false,
    index: true
  }
}, {
  timestamps: true
});

// Calculate discount percentage before saving
vehicleSchema.pre('save', function () {
  if (this.originalPrice && this.price) {
    this.discount = Math.round(((this.originalPrice - this.price) / this.originalPrice) * 100);
  }
});

const Vehicle = mongoose.models.Vehicle || mongoose.model('Vehicle', vehicleSchema);
export default Vehicle;
