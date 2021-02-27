import mongoose from 'mongoose';

const RatingEnum = [1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5];

const ReviewSchema = new mongoose.Schema(
  {
    rating: {
      type: Number,
      enum: RatingEnum
    },
    item: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Customer',
      required: true
    },
    comment: {
      type: String
    }
  },
  {
    timestamps: true
  }
);

export const Review = mongoose.model('Review', ReviewSchema);
