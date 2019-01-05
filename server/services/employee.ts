import {
  EmployeeCollection,
  EmployeeArchiveCollection
} from '../models/employee';
import { IUser } from '../models/user';

export async function list(args = {}) {
  return await EmployeeCollection.find(args).exec();
}

export function create(user: IUser, data: any) {
  const record = new EmployeeCollection(data);
  record.modifiedBy = user.username;

  return new Promise(resolve => {
    record
      .save()
      .then(tmp => resolve(tmp))
      .catch(err => resolve(err));
  });
}

export function update(user: IUser, id: string, data: any) {
  return new Promise(resolve => {
    EmployeeCollection.findOneAndUpdate({ _id: id }, data, (err, record) => {
      if (err) {
        return resolve(err);
      }

      record.oldId = record._id;
      delete record._id;
      record.modifiedBy = user.username;
      new EmployeeArchiveCollection(record).save();

      resolve(true);
    });
  });
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
