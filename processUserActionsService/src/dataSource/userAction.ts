import models from '../model';
import { UserAction } from '../lib/type/userAction';

export async function upsert(userAction: UserAction) {
  const [userActionUpserted] = await models.UserAction.upsert(userAction);

  return userActionUpserted;
}
