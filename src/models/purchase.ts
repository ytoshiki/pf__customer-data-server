import mongoose from 'mongoose';

const PurchaseSchema = new mongoose.Schema({
  item: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
    unique: true
  },
  total: {
    type: Number,
    default: 0
  }
});

export const Purchase = mongoose.model('Purchase', PurchaseSchema);
