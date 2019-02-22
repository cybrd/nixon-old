import {
  EmployeeScheduleCollection,
  EmployeeScheduleArchiveCollection
} from '../models/employeeSchedule';
import { IUser } from '../models/user';

import { EmployeeCollection } from '../models/employee';
import { ScheduleCollection } from '../models/schedule';
import { PayrollCollection } from '../models/payroll';

export async function list(args = {}) {
  return await EmployeeScheduleCollection.find(args).exec();
}

export async function listPopulated(args = {}, secondary: any = {}) {
  const results = await EmployeeScheduleCollection.find(args)
    .populate('employeeId')
    .populate('scheduleId')
    .populate('payrollId')
    .exec();

  return results.filter((result: any) => {
    if (!result.employeeId) {
      return false;
    }
    if (!result.scheduleId) {
      return false;
    }
    if (!result.payrollId) {
      return false;
    }
    if (secondary) {
      if (secondary.handler !== result.employeeId.handler) {
        return false;
      }
    }
    return true;
  });
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

        record = record.toJSON();
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

export async function removeMany(user: IUser, ids: string[] = []) {
  const records = await EmployeeScheduleCollection.find({ _id: ids })
    .lean()
    .exec();

  records.forEach((record: any) => {
    record.oldId = record._id;
    delete record._id;
    record.modifiedBy = user.username;
    new EmployeeScheduleArchiveCollection(record).save();
  });

  return await EmployeeScheduleCollection.deleteMany({ _id: ids }).exec();
}

export async function createFromUpload(user: IUser, raw: any) {
  const employees = await EmployeeCollection.find(
    {},
    { _id: 1, fingerPrintId: 1 }
  );
  const employeesObj = employees.reduce((acc: any, curr) => {
    acc[curr.fingerPrintId] = curr._id;
    return acc;
  }, {});

  const schedules = await ScheduleCollection.find({}, { _id: 1, name: 1 });
  const schedulesObj = schedules.reduce((acc: any, curr) => {
    acc[curr.name] = curr._id;
    return acc;
  }, {});

  const payrolls = await PayrollCollection.find({}, { _id: 1, name: 1 });
  const payrollsObj = payrolls.reduce((acc: any, curr) => {
    acc[curr.name] = curr._id;
    return acc;
  }, {});

  const data: any = [];

  raw.split('\n').forEach((line: string) => {
    const tmp = line.split(',');

    let i = 3;
    while (tmp[i]) {
      data.push({
        employeeId: employeesObj[tmp[0]],
        scheduleId: schedulesObj[tmp[1]],
        payrollId: payrollsObj[tmp[2]],
        date: new Date(tmp[i]),
        modifiedBy: user.username
      });
      i++;
    }
  });

  return new Promise(resolve => {
    EmployeeScheduleCollection.insertMany(
      data,
      { ordered: false },
      (err, docs: any) => {
        if (err) {
          return resolve({
            errors: err.writeErrors.length,
            inserted: err.result.result.nInserted
          });
        }

        resolve({
          errors: 0,
          inserted: docs.length
        });
      }
    );
  });
}
