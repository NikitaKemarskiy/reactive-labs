import { filter, map, Observable } from 'rxjs';
import * as userActionAdapter from '../lib/adapter/userAction';
import * as userActionDataSource from '../dataSource/userAction';
import * as sqsClient from '../lib/client/sqs';
import * as cmsService from '../service/cms';
import { UserActionType } from '../lib/enum/userActionType';
import { UserAction } from '../lib/type/userAction';

const USER_ACTIONS_QUEUE_NAME = 'userActions';

export function init() {
  const observable: Observable<UserAction> = sqsClient.getQueueObservable(
    USER_ACTIONS_QUEUE_NAME,
    { adapter: userActionAdapter }
  );

  observable.subscribe({
    next: userActionDataSource.upsert,
    error: console.error,
    complete: () => console.log('Stop handling users\' actions'),
  });

  observable
    .pipe(
      filter((userAction: UserAction) => userAction.type === UserActionType.CLOSE_PAGE),
      map((userAction: UserAction) => userAction.url)
    )
    .subscribe({
      next: cmsService.requestForRemarketing,
      error: console.error,
      complete: () => console.log('Stop requesting for remarketing by users\' actions'),
    })
}
