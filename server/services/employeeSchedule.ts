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

export function create(user: IUser, data: any) {
  const record = new EmployeeScheduleCollection(data);
  record.modifiedBy = user.username;

  return new Promise(resolve => {
    if (!data.date) {
      return resolve({
        errmsg: 'Error'
      });
    }

    record
      .save()
      .then(tmp => resolve(tmp))
      .catch(err => resolve(err));
  });
}

export function update(user: IUser, id: string, data: any) {
  return new Promise(resolve => {
    EmployeeScheduleCollection.findOneAndUpdate(
      { _id: id },
      data,
      (err, record) => {
        if (err) {
          return resolve(err);
        }

        record.oldId = record._id;
        delete record._id;
        record.modifiedBy = user.username;
        new EmployeeScheduleArchiveCollection(record).save();

        resolve(true);
      }
    );
  });
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
