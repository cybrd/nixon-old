import {
  ScheduleCollection,
  ScheduleArchiveCollection
} from '../models/schedule';
import { IUser } from '../models/user';

export async function list(args = {}) {
  return await ScheduleCollection.find(args).exec();
}

export function create(user: IUser, data: any) {
  const record = new ScheduleCollection(data);
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
    ScheduleCollection.findOneAndUpdate({ _id: id }, data, (err, record) => {
      if (err) {
        return resolve(err);
      }

      record.oldId = record._id;
      delete record._id;
      record.modifiedBy = user.username;
      new ScheduleArchiveCollection(record).save();

      resolve(true);
    });
  });
}

export async function remove(user: IUser, id: String) {
  const record = await ScheduleCollection.findOne({ _id: id })
    .lean()
    .exec();

  record.oldId = record._id;
  delete record._id;
  record.modifiedBy = user.username;
  new ScheduleArchiveCollection(record).save();

  return await ScheduleCollection.deleteOne({ _id: id }).exec();
}
