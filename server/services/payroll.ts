import { PayrollCollection, PayrollArchiveCollection } from '../models/payroll';
import { IUser } from '../models/user';

export async function list(args = {}) {
  return await PayrollCollection.find(args)
    .sort({ name: 1 })
    .exec();
}

export function create(user: IUser, data: any) {
  const record = new PayrollCollection(data);
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
    PayrollCollection.findOneAndUpdate({ _id: id }, data, (err, record) => {
      if (err) {
        return resolve(err);
      }

      record.oldId = record._id;
      delete record._id;
      record.modifiedBy = user.username;
      new PayrollArchiveCollection(record).save();

      resolve(true);
    });
  });
}

export async function remove(user: IUser, id: string) {
  const record = await PayrollCollection.findOne({ _id: id })
    .lean()
    .exec();

  record.oldId = record._id;
  delete record._id;
  record.modifiedBy = user.username;
  new PayrollArchiveCollection(record).save();

  return await PayrollCollection.deleteOne({ _id: id }).exec();
}
