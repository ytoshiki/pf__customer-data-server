import mongoose, { Model, ObjectId } from 'mongoose';
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
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Review'
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

ProductSchema.statics.filterReviewById = async function (r_id) {
  try {
    const targets = await this.find({
      reviews: {
        $in: [r_id]
      }
    });

    for (let target of targets) {
      (target as any).reviews = (target as any).reviews.filter((review: ObjectId) => {
        return review.toString() !== r_id;
      });

      await target.save();
    }

    return true;
  } catch (error) {
    console.log(error.message);
    return false;
  }
};

interface IProductModel extends Model<IProduct> {
  filterReviewById(r_id: string): boolean;
}

export const Product = mongoose.model<IProduct, IProductModel>('Product', ProductSchema);
