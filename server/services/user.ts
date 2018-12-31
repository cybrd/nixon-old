import { UserCollection, UserArchiveCollection, IUser } from '../models/user';

export async function list(args = {}) {
  return await UserCollection.find(args).exec();
}

export async function create(user: IUser, data: any) {
  const record = new UserCollection(data);
  record.modifiedBy = user.username;

  return new Promise(resolve => {
    record
      .save()
      .then(tmp => resolve(tmp))
      .catch(err => resolve(err));
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
