import {
  EmployeeCollection,
  EmployeeArchiveCollection
} from '../models/employee';
import { IUser } from '../models/user';

export async function list(args = {}) {
  return await EmployeeCollection.find(args).exec();
}

export async function create(user: IUser, data: any) {
  const record = new EmployeeCollection(data);
  record.modifiedBy = user.username;

  return new Promise(resolve => {
    record
      .save()
      .then(tmp => resolve(tmp))
      .catch(err => resolve(err));
  });
}

export async function update(user: IUser, id: string, data: any) {
  const record = await EmployeeCollection.findOneAndUpdate(
    { _id: id },
    data
  ).lean();

  record.oldId = record._id;
  delete record._id;
  record.modifiedBy = user.username;
  new EmployeeArchiveCollection(record).save();

  return true;
}

export async function remove(user: IUser, id: string) {
  const record = await EmployeeCollection.findOne({ _id: id })
    .lean()
    .exec();

  record.oldId = record._id;
  delete record._id;
  record.modifiedBy = user.username;
  new EmployeeArchiveCollection(record).save();

  return await EmployeeCollection.deleteOne({ _id: id }).exec();
}
