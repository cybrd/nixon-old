import { model, Document, Schema } from 'mongoose';

const UserSchema = new Schema(
  {
    username: String,
    password: String,
    role: String,
    employeeId: String,
    modifiedBy: String
  },
  {
    collection: 'user',
    timestamps: true
  }
);

const UserArchiveSchema = new Schema(
  {
    oldId: Schema.Types.ObjectId,
    username: String,
    password: String,
    role: String,
    employeeId: String,
    modifiedBy: String
  },
  {
    collection: 'userArchive',
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

export interface IUser extends Document {
  oldId?: string;
  username: string;
  password: string;
  role: string;
  modifiedBy: string;
}

export const UserCollection = model<IUser>('user', UserSchema);
export const UserArchiveCollection = model<IUser>(
  'userArchive',
  UserArchiveSchema
);
