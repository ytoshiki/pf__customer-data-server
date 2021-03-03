import mongoose, { ObjectId } from 'mongoose';
import { IProduct } from '../interfaces/product';

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
    images: [
      {
        type: String,
        required: true
      }
    ],
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

ProductSchema.methods.addImages = async function (image: string) {
  (this as any).images = (this as any).images.push(image);
  try {
    await (this as any).save();
  } catch (error) {
    console.log(error);
  }
};

ProductSchema.methods.addReviews = async function (review: ObjectId) {
  (this as any).reviews = (this as any).reviews.push(review);
  try {
    await (this as any).save();
  } catch (error) {
    console.log(error);
  }
};

export const Product = mongoose.model<IProduct>('Product', ProductSchema);
