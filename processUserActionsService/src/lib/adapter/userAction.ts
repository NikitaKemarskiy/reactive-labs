import { UserActionType } from '../enum/userActionType';
import { UserAction } from '../type/userAction';

function getUserActionType(message): UserActionType {
  switch (message.type) {
    case 'click': {
      return UserActionType.CLICK;
    }
    case 'scroll': {
      return UserActionType.SCROLL;
    }
    case 'openPage': {
      return UserActionType.OPEN_PAGE;
    }
    case 'closePage': {
      return UserActionType.CLOSE_PAGE;
    }
    default: {
      throw new Error('Unknown user action')
    }
  }
}

export function deserialize(message): UserAction {
  return {
    type: getUserActionType(message),
    userId: message.usedId,
    url: message.url,
    timestamp: message.timestamp,
  }
}
