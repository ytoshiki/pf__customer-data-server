import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true
    },
    price: {
      type: Number,
      required: true
    },
    image: {
      type: String,
      required: true
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: true
    },
    reviews: [
      {
        review: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Review'
        }
      }
    ]
  },
  {
    timestamps: true
  }
);

export const Product = mongoose.model('Product', ProductSchema);
