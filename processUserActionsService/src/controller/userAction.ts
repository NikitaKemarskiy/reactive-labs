import { filter, map, Observable } from 'rxjs';
import * as userActionAdapter from '../lib/adapter/userAction';
import * as userActionValidator from '../lib/validator/userAction';
import * as userActionDataSource from '../dataSource/userAction';
import * as sqsClient from '../lib/client/sqs';
import * as cmsService from '../service/cms';
import { UserActionType } from '../lib/enum/userActionType';
import { UserAction } from '../lib/type/userAction';
import { Queue } from '../lib/enum/queue';

export async function init() {
  const observable: Observable<UserAction> = await sqsClient.getQueueObservable(
    Queue.USER_ACTIONS,
    {
      adapter: userActionAdapter,
      validator: userActionValidator,
    }
  );

  observable.subscribe({
    next: async (userAction: UserAction) => {
      console.log('Start handling user action');
      
      try {
        await userActionDataSource.upsert(userAction);

        if (userAction.type === UserActionType.CLOSE_PAGE) {
          await cmsService.requestForRemarketing(userAction.url);
        }
      } catch (err) {
        console.error(err);
      }

      console.log('User action handled successfully');
    },
    error: console.error,
    complete: () => console.log('Stop handling users\' actions'),
  });

  // observable
  //   .pipe(
  //     filter((userAction: UserAction) => userAction.type === UserActionType.CLOSE_PAGE),
  //     map((userAction: UserAction) => userAction.url)
  //   )
  //   .subscribe({
  //     next: cmsService.requestForRemarketing,
  //     error: console.error,
  //     complete: () => console.log('Stop requesting for remarketing by users\' actions'),
  //   })
}
