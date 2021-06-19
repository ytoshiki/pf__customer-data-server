import mongoose, { Schema } from 'mongoose';
import Customer from '../interfaces/customer';
import bcrypt from 'bcryptjs';

const CustomerSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    email: {
      type: String,
      required: true
    },
    password: {
      type: String,
      required: true,
      minLength: 6
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

// Hash password before saving
CustomerSchema.pre('save', async function (next) {
  try {
    if (!(this as any).isModified('password')) return next();

    const salt = await bcrypt.genSalt(10);
    (this as any).password = await bcrypt.hash((this as any).password, salt);
    return next();
  } catch (error) {
    return next(error);
  }
});

// Varify password
CustomerSchema.methods.verifyPassword = async (password: string) => {
  try {
    const success = await bcrypt.compare(password, (this as any).password);
    if (success) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    return false;
  }
};

export const Customer = mongoose.model<Customer>('Customer', CustomerSchema);
