import { Document } from 'mongoose';

export default interface Customer extends Document {
  username: string;
  email: string;
  nat: string;
  age: number;
  dateRegistered: Date;
  gender: string;
  avator: string | null;
  purchasedItems: any[];
}
