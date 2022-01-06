import * as _ from 'lodash';
import {
  of,
  catchError,
  interval,
  mergeMap,
  filter,
  Observable,
  EMPTY
} from 'rxjs';
import {
  SQSClient,
  ReceiveMessageCommand,
  DeleteMessageCommand,
  GetQueueUrlCommand
} from '@aws-sdk/client-sqs';
import { Queue } from '../enum/queue';

const MESSAGE_POLLING_INTERVAL_MILLISECONDS = 5e3;
const MESSAGE_VISIBILITY_TIMEOUT_SECONDS = 120;

const client = new SQSClient({ region: process.env.AWS_REGION });

export async function getQueueObservable<T>(queue: Queue, params: {
  adapter: {
    deserialize: (message: Object) => T,
  },
  validator: {
    verify: (message: T) => boolean,
  }
}): Promise<Observable<T>> {
  const { QueueUrl: queueUrl } = await client.send(new GetQueueUrlCommand({
    QueueName: queue,
  }));

  const receiveMessageCommand = new ReceiveMessageCommand({
    QueueUrl: queueUrl,
    AttributeNames: ['SentTimestamp'],
    VisibilityTimeout: MESSAGE_VISIBILITY_TIMEOUT_SECONDS,
  });

  return interval(MESSAGE_POLLING_INTERVAL_MILLISECONDS)
    .pipe(
      mergeMap((item) => of(item)
        .pipe(
          mergeMap(async () => {
            const data = await client.send(receiveMessageCommand);
            /**
             * Messages is an array with only one
             * message - retrieve the first
             */
            const message = _.get(data.Messages, 0);
    
            /**
             * There's a message - delete it from queue
             */
            if (message) {
              await client.send(new DeleteMessageCommand({
                QueueUrl: queueUrl,
                ReceiptHandle: message.ReceiptHandle,
              }));              
            }

            return params.adapter.deserialize(message);
          }),
          catchError((err) => {
            console.error(err);
            
            return EMPTY;
          })
        )
      ),
      filter(params.validator.verify),
    );
}