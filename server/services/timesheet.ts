import {
  TimesheetCollection,
  TimesheetArchiveCollection,
  ITimesheet
} from '../models/timesheet';
import { EmployeeCollection } from '../models/employee';
import { IUser } from '../models/user';
import { arrayToObject } from '../helpers/arrayToObject';

export async function list(args: any = {}, sort = -1, secondary = {}) {
  let employees = await EmployeeCollection.find(secondary)
    .lean()
    .exec();
  employees = arrayToObject(employees, 'fingerPrintId');

  if (!args.fingerPrintId) {
    args.fingerPrintId = { $in: Object.keys(employees) };
  }

  let results = await TimesheetCollection.find(args)
    .sort({ timestamp: sort })
    .limit(12000)
    .lean()
    .exec();

  results = results.filter((result: any) => employees[result.fingerPrintId]);
  results.map(
    (result: any) => (result.employee = employees[result.fingerPrintId])
  );

  return results;
}

export function create(user: IUser, data: any) {
  const record = new TimesheetCollection(data);
  record.modifiedBy = user.username;

  return new Promise(resolve => {
    if (!data.date) {
      return resolve({
        errmsg: 'Error'
      });
    }

    record.timestamp = new Date(data.date);
    record.timestamp.setHours(data.hour);
    record.timestamp.setMinutes(data.minute);
    record.timestamp.setSeconds(0);

    record
      .save()
      .then(tmp => resolve(tmp))
      .catch(err => resolve(err));
  });
}

export function createFromUpload(user: IUser, records: any) {
  const data: any = [];
  records.forEach((record: any) => {
    data.push({
      fingerPrintId: record.userId,
      timestamp: record.time,
      type: record.code,
      modifiedBy: user.username
    });
  });

  return customInsertMany(data);
}

export function createFromUploadCSV(user: IUser, records: string) {
  const data: any = [];
  let counter = 0;
  records.split('\n\r').forEach(line => {
    if (!line || !counter) {
      counter++;
      return;
    }

    const lineData = line.split(',');

    data.push({
      fingerPrintId: lineData[0],
      timestamp: new Date(lineData[1] + ' ' + lineData[2]),
      type: lineData[3],
      modifiedBy: user.username
    });

    counter++;
  });

  return customInsertMany(data);
}

async function customInsertMany(data: ITimesheet[]) {
  const result = {
    errors: 0,
    inserted: 0
  };

  for (const d of data) {
    const upperTimeLimit = new Date(d.timestamp.getTime());
    upperTimeLimit.setSeconds(upperTimeLimit.getSeconds() + 120);

    const lowerTimeLimit = new Date(d.timestamp.getTime());
    lowerTimeLimit.setSeconds(lowerTimeLimit.getSeconds() - 120);

    const findNear = await TimesheetCollection.find({
      fingerPrintId: d.fingerPrintId,
      type: d.type,
      timestamp: {
        $gte: lowerTimeLimit,
        $lte: upperTimeLimit
      }
    });

    if (!findNear.length) {
      await TimesheetCollection.create(d);
      result.inserted++;
    } else {
      result.errors++;
    }
  }

  return result;
}

export function update(user: IUser, id: string, data: any) {
  data.timestamp = new Date(data.date);
  data.timestamp.setHours(data.hour);
  data.timestamp.setMinutes(data.minute);
  data.timestamp.setSeconds(0);

  return new Promise(resolve => {
    TimesheetCollection.findOneAndUpdate({ _id: id }, data, (err, record) => {
      if (err) {
        return resolve(err);
      }

      record = record.toJSON();
      record.oldId = record._id;
      delete record._id;
      record.modifiedBy = user.username;
      new TimesheetArchiveCollection(record).save();

      resolve(true);
    });
  });
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

export async function removeMany(user: IUser, ids: string[] = []) {
  const records = await TimesheetCollection.find({ _id: ids })
    .lean()
    .exec();

  records.forEach((record: any) => {
    record.oldId = record._id;
    delete record._id;
    record.modifiedBy = user.username;
    new TimesheetArchiveCollection(record).save();
  });

  return await TimesheetCollection.deleteMany({ _id: ids }).exec();
}
