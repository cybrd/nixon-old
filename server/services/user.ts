import { UserCollection } from '../models/user';

export async function List() {
  return await UserCollection.find().exec();
}

export async function Create(data: any) {
  const user = new UserCollection(data);

  return new Promise(resolve => {
    user
      .save()
      .then(data => resolve(data))
      .catch(err => resolve(err));
  });
}
