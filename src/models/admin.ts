import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import Admin from '../interfaces/admin';

const AdminSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minLength: 6,
    select: false
  }
});

// Hash password before saving
AdminSchema.pre('save', async function (next) {
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
AdminSchema.methods.verifyPassword = async (password: string) => {
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

// Exclude password and id when returned
AdminSchema.set('toJSON', {
  transform: function (doc: any, ret: any, options: any) {
    delete ret.password;
    delete ret._id;
    return ret;
  }
});

export const Admin = mongoose.model<Admin>('Admin', AdminSchema);
