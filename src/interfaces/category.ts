import { Document, ObjectId, Model } from 'mongoose';

export interface ICategory extends Document {
  name: string;
  image: string;
  heading: string;
  paragraph: null | string;
  products: ObjectId[];

  // Methods
}
