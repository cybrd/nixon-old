import { UserCollection } from '../models/user';

export async function loginLocal(
  username: string,
  password: string,
  done: Function
) {
  const user = await UserCollection.findOne({
    username: username,
    password: password
  }).exec();

  if (!user) {
    return done(null, false);
  }

  return done(null, user);
}
