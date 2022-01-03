import * as sqsClient from '../lib/client/sqs';
import * as userActionAdapter from '../lib/adapter/userAction';
import * as userActionDataSource from '../dataSource/userAction';
import * as cmsService from '../service/cms';
import { UserActionType } from '../lib/enum/userActionType';
import { UserAction } from '../lib/type/userAction';

const USER_ACTIONS_QUEUE_NAME = 'userActions';

export function init() {
  const observer = {
    async next(userAction: UserAction) {
      await userActionDataSource.upsert(userAction);

      switch (userAction.type) {
        case UserActionType.CLOSE_PAGE: {
          await cmsService.requestForRemarketing(userAction.url);
          break;
        }
      }
    },
    error(err) {
      console.error(err);
    },
    complete() {
      console.log('Stop handling users\' actions');
    }
  };

  const observable = sqsClient.getQueueObservable(USER_ACTIONS_QUEUE_NAME, { adapter: userActionAdapter });

  observable.subscribe(observer);
}
