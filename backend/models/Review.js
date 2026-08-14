import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  productId: {
    type: String, // String because Product IDs are hardcoded in the frontend catalog and mapped as strings, e.g. "69a27e1229617734ff8f03f4"
    required: true,
    index: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  userName: {
    type: String,
    required: true
  },
  petName: {
    type: String,
    default: ''
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    required: true,
    trim: true,
    maxlength: 1000
  },
  verified: {
    type: Boolean,
    default: true // Future: logic to verify if user bought product
  }
}, { timestamps: true });

export default mongoose.model('Review', reviewSchema);
