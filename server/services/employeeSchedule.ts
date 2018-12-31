import {
  EmployeeScheduleCollection,
  EmployeeScheduleArchiveCollection
} from '../models/employeeSchedule';
import { IUser } from '../models/user';

export async function list(args = {}) {
  return await EmployeeScheduleCollection.find(args).exec();
}

export async function listPopulated(args = {}) {
  return await EmployeeScheduleCollection.find(args)
    .populate('employeeId')
    .populate('scheduleId')
    .populate('payrollId')
    .exec();
}

export async function create(user: IUser, data: any) {
  const record = new EmployeeScheduleCollection(data);
  record.modifiedBy = user.username;

  return new Promise(resolve => {
    record
      .save()
      .then(tmp => resolve(tmp))
      .catch(err => resolve(err));
  });
}

export async function update(user: IUser, id: string, data: any) {
  const record = await EmployeeScheduleCollection.findOneAndUpdate(
    { _id: id },
    data
  ).lean();

  record.oldId = record._id;
  delete record._id;
  record.modifiedBy = user.username;
  new EmployeeScheduleArchiveCollection(record).save();

  return true;
}

export async function remove(user: IUser, id: string) {
  const record = await EmployeeScheduleCollection.findOne({ _id: id })
    .lean()
    .exec();

  record.oldId = record._id;
  delete record._id;
  record.modifiedBy = user.username;
  new EmployeeScheduleArchiveCollection(record).save();

  return await EmployeeScheduleCollection.deleteOne({ _id: id }).exec();
}
