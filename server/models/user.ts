import * as mongoose from 'mongoose';

export const UserSchema = new mongoose.Schema(
  {
    username: String,
    password: String,
    role: String
  },
  {
    collection: 'user',
    timestamps: true
  }
);

UserSchema.index(
  {
    username: 1
  },
  {
    name: 'uindex',
    unique: true
  }
);

interface IUser extends mongoose.Document {
  username: string;
  password: string;
  role: string;
}

export const UserCollection = mongoose.model<IUser>('user', UserSchema);
