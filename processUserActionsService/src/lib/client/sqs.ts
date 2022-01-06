import * as _ from 'lodash';
import {
  share,
  from,
  catchError,
  interval,
  map,
  mergeMap,
  filter,
  Observable,
  EMPTY,
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
      mergeMap(() => from(client.send(receiveMessageCommand))
        .pipe(
          map((data) => _.get(data.Messages, 0)),
          filter(_.identity),
          mergeMap(async (message) => {
            await client.send(new DeleteMessageCommand({
              QueueUrl: queueUrl,
              ReceiptHandle: message.ReceiptHandle,
            }));

            return message;
          }),
          map(params.adapter.deserialize),
          catchError((err) => {
            console.error(err);
            
            return EMPTY;
          }),
        )
      ),
      filter(params.validator.verify),
      share({
        resetOnRefCountZero: true,
      }),
    );
}