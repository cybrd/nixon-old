import { UserCollection, UserArchiveCollection, IUser } from '../models/user';

export async function list(args = {}) {
  return await UserCollection.find(args)
    .select({ _id: 1, username: 1, role: 1 })
    .exec();
}

export function create(user: IUser, data: any) {
  const record = new UserCollection(data);
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
    UserCollection.findOneAndUpdate({ _id: id }, data, (err, record) => {
      if (err) {
        return resolve(err);
      }

      record = record.toJSON();
      record.oldId = record._id;
      delete record._id;
      record.modifiedBy = user.username;
      new UserArchiveCollection(record).save();

      resolve(true);
    });
  });
}

export async function remove(user: IUser, id: String) {
  const record = await UserCollection.findOne({ _id: id })
    .lean()
    .exec();

  record.oldId = record._id;
  delete record._id;
  record.modifiedBy = user.username;
  new UserArchiveCollection(record).save();

  return await UserCollection.deleteOne({ _id: id }).exec();
}
