import mongoose, { Schema } from 'mongoose';
import Customer from '../interfaces/customer';

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
    nat: {
      type: String,
      enum: ['GB', 'FR', 'DK', 'NO', 'NL', 'US', 'NZ', 'FI', 'ES', 'CA', 'BR', 'AU', 'JP'],
      required: true
    },
    age: {
      type: Number,
      min: 17,
      max: 100,
      required: true
    },
    dateRegistered: {
      type: Date,
      required: true
    },
    gender: {
      type: String,
      enum: ['male', 'female'],
      required: true
    },
    avator: {
      type: String,
      default: null
    },
    purchasedItems: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Product'
      }
    ]
  },
  {
    timestamps: true
  }
);

export const Customer = mongoose.model<Customer>('Customer', CustomerSchema);
