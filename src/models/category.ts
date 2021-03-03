import mongoose, { Model, ObjectId, Schema } from 'mongoose';
import { ICategory } from '../interfaces/category';

const CategorySchema: Schema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  heading: {
    type: String,
    required: true
  },
  paragraph: {
    type: String,
    default: null
  },
  products: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Product'
    }
  ]
});

CategorySchema.statics.filterProductById = async function (p_id) {
  try {
    const targets = await this.find({
      products: {
        $in: [p_id]
      }
    });

    for (let target of targets) {
      (target as any).products = (target as any).products.filter((product: ObjectId) => {
        return product.toString() !== p_id;
      });

      await target.save();
    }
  } catch (error) {}
};

interface ICategoryModel extends Model<ICategory> {
  filterProductById(p_id: ObjectId): any;
}

export const Category = mongoose.model<ICategory, ICategoryModel>('Category', CategorySchema);
