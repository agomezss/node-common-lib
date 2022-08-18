
import { SQS } from 'aws-sdk';
import { Log } from '../logging/log';

export class SqsService {

	public static postSqsMessage(queueName: string, message: string): Promise<any> {

		return new Promise(async (resolve, reject) => {

			const sns: SQS = new SQS();

			const params = {
				QueueUrl: queueName,
				MessageBody: message
			};

			await sns.sendMessage(params, (err, data) => {

				if (!err) {

					Log.info(`Enqueued SQS to queue: ${queueName}`, data);
					resolve(data);

				} else {

					Log.error('SQS Failed to deliver message', params, err);
					reject(err);
				}

			});
		});
	}

	public static deleteSqsMessage(queueName: string, receiptHandle: string): Promise<any> {

		return new Promise(async (resolve, reject) => {

			const sns: SQS = new SQS();

			const params = {
				QueueUrl: queueName,
				ReceiptHandle: receiptHandle
			};

			await sns.deleteMessage(params, (err, data) => {

				if (!err) {

					Log.info('Deleted SQS message OK', data);
					resolve(data);

				} else {

					Log.error('SQS Failed to delete message', params, err);
					reject(err);
				}
			});
		});
	}
}