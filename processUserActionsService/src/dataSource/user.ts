import models from '../model';

export async function upsert(user) {
  const [userUpserted] = await models.User.upsert(user);

  return userUpserted;
}
