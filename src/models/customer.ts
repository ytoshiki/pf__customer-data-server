import mongoose from 'mongoose';

const CustomerSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    nat: String,
    age: Number,
    dateRegisterd: {
      type: String,
      default: null
    },
    gender: String,
    avator: {
      type: String,
      default: null
    },
    ItemsPurchases: [
      {
        Item: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product'
        }
      }
    ]
  },
  {
    timestamps: true
  }
);

export const Customer = mongoose.model('Customer', CustomerSchema);
