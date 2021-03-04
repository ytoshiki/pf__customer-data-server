import mongoose from 'mongoose';

const PurchaseSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Customer',
      required: true
    }
  },
  {
    timestamps: true
  }
);

export const Purchase = mongoose.model('Purchase', PurchaseSchema);
