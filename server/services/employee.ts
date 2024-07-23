import * as parse from 'csv-parse/lib/sync';
import { unlinkSync } from 'fs';

import {
  EmployeeCollection,
  EmployeeArchiveCollection,
  EmployeeNotStrictCollection,
} from '../models/employee';
import { IUser } from '../models/user';

export async function list(args = {}) {
  return await EmployeeCollection.find(args).exec();
}

export async function listArchive(args = {}) {
  return await EmployeeArchiveCollection.find(args).exec();
}

export function create(user: IUser, data: any) {
  const record = new EmployeeCollection(data);
  record.modifiedBy = user.username;

  return new Promise((resolve) => {
    record
      .save()
      .then((tmp) => resolve(tmp))
      .catch((err) => resolve(err));
  });
}

export function update(user: IUser, id: string, data: any) {
  return new Promise((resolve) => {
    for (const x in data) {
      if (data[x] === 'null') {
        data[x] = '';
      }
    }
    EmployeeCollection.findOneAndUpdate({ _id: id }, data, (err, record) => {
      if (err) {
        return resolve(err);
      }

      record = record.toJSON();
      record.oldId = record._id;
      delete record._id;
      record.modifiedBy = user.username;
      new EmployeeArchiveCollection(record).save();

      resolve(true);
    });
  });
}

export async function changePhoto(id: string, data: any) {
  const old = await EmployeeCollection.findOneAndUpdate(
    { _id: id },
    {
      photo: data.filename,
      photoType: data.mimetype,
    }
  );

  if (old && old.photo) {
    unlinkSync(data.destination + '/' + old.photo);
  }
}

export async function remove(user: IUser, id: string) {
  const record = await EmployeeCollection.findOne({ _id: id }).lean().exec();

  record.oldId = record._id;
  delete record._id;
  record.modifiedBy = user.username;
  new EmployeeArchiveCollection(record).save();

  return await EmployeeCollection.deleteOne({ _id: id }).exec();
}

export async function removeArchive(id: string) {
  return await EmployeeArchiveCollection.deleteOne({ _id: id }).exec();
}

export async function removeMany(user: IUser, ids: string[] = []) {
  const records = await EmployeeCollection.find({ _id: ids }).lean().exec();

  records.forEach((record: any) => {
    record.oldId = record._id;
    delete record._id;
    record.modifiedBy = user.username;
    new EmployeeArchiveCollection(record).save();
  });

  return await EmployeeCollection.deleteMany({ _id: ids }).exec();
}

export async function removeManyArchive(ids: string[] = []) {
  return await EmployeeArchiveCollection.deleteMany({ _id: ids }).exec();
}

export async function createFromUpload(raw: any) {
  const records = parse(raw, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
  });

  return new Promise((resolve) => {
    EmployeeNotStrictCollection.insertMany(
      records,
      { ordered: false },
      (err, docs: any) => {
        if (err) {
          return resolve(err);
        }

        resolve({
          errors: 0,
          inserted: docs.length,
        });
      }
    );
  });
}
