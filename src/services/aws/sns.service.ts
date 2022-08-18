
import { SNS } from 'aws-sdk';
import { Log } from '../logging/log';

export class SnsService {

	public static postSnsMessage(topic: string, message: string, options?: any): Promise<any> {

		return new Promise(async (resolve, reject) => {

			const sns: SNS = new SNS(options);

			const params = {
				TopicArn: topic,
				Message: message
			};

			await sns.publish(params, (err, data) => {

				if (!err) {

					Log.info(`Posted SNS Message to topic: ${topic}`, data);
					resolve(data);

				} else {

					Log.error('Failed to deliver SNS Message', params, err);
					reject(err);
				}
			});
		});
	}
}