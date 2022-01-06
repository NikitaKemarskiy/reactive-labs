import { UserActionType } from '../enum/userActionType';
import { UserAction } from '../type/userAction';

export function verify(userAction: UserAction): boolean {
  return !!(
    userAction
    && Object.values(UserActionType).includes(userAction.type)
    && userAction.userId
    && userAction.url
    && userAction.timestamp
  );
}
