import { Document } from 'mongoose';

export default interface Admin extends Document {
  name: string;
  password: string;
  verifyPassword: (password: string) => boolean;
}
