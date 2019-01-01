import {
  TimesheetCollection,
  TimesheetArchiveCollection
} from '../models/timesheet';
import { IUser } from '../models/user';

export async function list(args = {}) {
  return await TimesheetCollection.find(args)
    .sort({ timestamp: 1 })
    .exec();
}

export async function create(user: IUser, data: any) {
  const record = new TimesheetCollection(data);
  record.modifiedBy = user.username;
  record.timestamp = new Date(data.date);
  record.timestamp.setHours(data.hour);
  record.timestamp.setMinutes(data.minute);
  record.timestamp.setSeconds(0);

  return new Promise(resolve => {
    record
      .save()
      .then(tmp => resolve(tmp))
      .catch(err => resolve(err));
  });
}

export async function createFromUpload(user: IUser, data: any) {
  const record = new TimesheetCollection({
    fingerPrintId: data.userId,
    timestamp: data.time,
    type: data.code,
    modifiedBy: user.username
  });

  return new Promise(resolve => {
    record
      .save()
      .then(tmp => resolve(tmp))
      .catch(err => resolve(err));
  });
}

export async function update(user: IUser, id: string, data: any) {
  data.timestamp = new Date(data.date);
  data.timestamp.setHours(data.hour);
  data.timestamp.setMinutes(data.minute);
  data.timestamp.setSeconds(0);

  const record = await TimesheetCollection.findOneAndUpdate(
    { _id: id },
    data
  ).lean();

  record.oldId = record._id;
  delete record._id;
  record.modifiedBy = user.username;
  new TimesheetArchiveCollection(record).save();

  return true;
}

export async function remove(user: IUser, id: String) {
  const record = await TimesheetCollection.findOne({ _id: id })
    .lean()
    .exec();

  record.oldId = record._id;
  delete record._id;
  record.modifiedBy = user.username;
  new TimesheetArchiveCollection(record).save();

  return await TimesheetCollection.deleteOne({ _id: id }).exec();
}
