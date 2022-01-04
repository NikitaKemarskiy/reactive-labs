import * as _ from 'lodash';
import {
  interval,
  mergeMap,
  filter,
  Observable
} from 'rxjs';
import {
  SQSClient,
  ReceiveMessageCommand,
  DeleteMessageCommand
} from '@aws-sdk/client-sqs';
import { UserAction } from '../type/userAction';

const MESSAGE_POLLING_INTERVAL_MILLISECONDS = 1e3;
const MESSAGE_VISIBILITY_TIMEOUT_SECONDS = 120;

const client = new SQSClient({ region: process.env.AWS_REGION });

function getQueueURL(queueName) {
  return `https://sqs.${process.env.AWS_REGION}.amazonaws.com/${process.env.AWS_ACCOUNT_ID}/${queueName}`;
}

export function getQueueObservable<T>(queueName: string, params: {
  adapter: {
    deserialize: (message: Object) => T,
  },
}): Observable<T> {
  const queueURL = getQueueURL(queueName);
  const command = new ReceiveMessageCommand({
    QueueUrl: queueURL,
    VisibilityTimeout: MESSAGE_VISIBILITY_TIMEOUT_SECONDS,
  });

  return interval(MESSAGE_POLLING_INTERVAL_MILLISECONDS)
    .pipe(
      mergeMap(async () => {
        const data = await client.send(command);
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
            QueueUrl: queueURL,
            ReceiptHandle: message.ReceiptHandle,
          }));
        }

        return params.adapter.deserialize(message);
      }),
      filter(_.identity),
    );
}