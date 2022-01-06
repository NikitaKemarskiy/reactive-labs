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

/**
 * 
 * @param message - Object with message
 * @returns 
 */
export function deserialize(message): UserAction {
  const body = JSON.parse(message.Body);

  return {
    type: getUserActionType(body),
    userId: parseInt(body.userId),
    url: body.url,
    timestamp: parseInt(message.Attributes.SentTimestamp),
  };
}
