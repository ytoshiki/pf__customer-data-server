import mongoose from 'mongoose';

const CategorySchema = new mongoose.Schema({
  name: String
});

export const Category = mongoose.model('Category', CategorySchema);
