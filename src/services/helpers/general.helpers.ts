
import * as fs from 'fs';
import { S3 } from 'aws-sdk';
import { ServiceResult } from '../../interfaces/ServiceResult';
import { Log } from '../logging/log';

export class Helpers {

	public static stringify(obj: any, removeNulls: boolean = true): any {
		// Prevent circular reference
		var cache = [];
		return JSON.stringify(obj, function (key, value) {

			if (removeNulls && (value == null || value == undefined)) return;

			if (typeof value === 'object' && value !== null) {
				if (cache.indexOf(value) !== -1) {
					// Duplicate reference found, discard key
					return;
				}
				// Store value in our collection
				cache.push(value);
			}
			return value;
		});
	}

	public static removeNullProperties(baseObject: any): any {
		var newObj = {};

		Object.keys(baseObject).forEach(function (key) {
			if (baseObject[key] !== null)
				newObj[key] = baseObject[key];
		});

		return newObj;
	}

	public static getPayloadFromHttpRequest(baseObject: any): any {
		let body = baseObject.body;
		if (body) {
			let json = JSON.parse(body);
			return json;
		}
		return null;
	}

	public static getMessageObjectFromSQS(baseObject: any): any {

		let body = baseObject;
		let sqsId;

		if (body.Records) {

			body = JSON.parse(baseObject.Records[0].body);
			sqsId = baseObject.Records[0].messageId;
		}

		if (body.Message) {

			body = JSON.parse(body.Message);
			body['originalSqsMessageId'] = sqsId;
		}

		if (body.payload) {
			Helpers.transferQueueProperties(body, body.payload);
		}

		return body;
	}

	public static getParamObjectFromSqsPayload(baseObject: any): any {

		let body = baseObject;

		if (body.Records) {

			body = JSON.parse(baseObject.Records[0].body);
			body['originalSqsMessageId'] = baseObject.Records[0].messageId;
		}

		return this.getParamObjectFromPayload(body);
	}

	public static transferQueueProperties(srcObject: any, targetObject: any) {

		if (srcObject.originalSqsMessageId) {
			targetObject.originalSqsMessageId = srcObject.originalSqsMessageId;
		}
	}

	public static transferQueuePropertiesToDbObject(srcObject: any, targetObject: any) {

		if (srcObject.originalSqsMessageId) {
			targetObject.sourceSqsMessageId = srcObject.originalSqsMessageId;
		}
	}

	public static getPrincipalId(request: any): string {

		if (!request || !request.requestContext || !request.requestContext.authorizer)
			return '';

		if (request.requestContext.authorizer.principalId &&
			request.requestContext.authorizer.principalId !== '')
			return request.requestContext.authorizer.principalId;

		if (!request.requestContext.authorizer.claims)
			return '';

		let sub = request.requestContext.authorizer.claims.sub;

		if (sub && sub !== '') {
			let split = sub.split('|');
			if (split && split.length > 1) {
				return split[1];
			}
		}

		return '';
	}

	public static getValueFromHeader(key: string, request: any): any {
		let header = request.headers;
		if (header) {
			return header[key];
		}
		return null;
	}

	public static getPathParameter(parameter: string, request: any): string {
		let value = null;
		let pathParameters = request.pathParameters;
		if (pathParameters) {
			value = pathParameters[parameter];
		}

		if (!value || value == null) {
			Log.warn(`Path parameter ${parameter} not found.`);
		}

		return value;
	}

	public static getParamObjectFromPayload(baseObject: any): any {

		let paramObj = baseObject;

		if (paramObj.body) {

			paramObj = JSON.parse(paramObj.body);

			if (paramObj.Message) {

				paramObj = JSON.parse(paramObj.Message);
			}
		}

		if (paramObj.payload) paramObj = paramObj.payload;

		Helpers.transferQueueProperties(baseObject, paramObj);

		return paramObj;
	}

	public static getParamObjectFromPayloadRest(baseObject: any): any {

		let paramObj = Helpers.getParamObjectFromPayload(baseObject);

		if (paramObj._rest) { paramObj = paramObj._rest; }

		Helpers.transferQueueProperties(baseObject, paramObj);

		return paramObj;
	}

	public static createSnsMessage(payload: any) {

		const fileContent = fs.readFileSync('./resources/sample_sns_message_body.json', 'utf-8');

		let contentObj = JSON.parse(fileContent);

		if (typeof payload === 'string') {
			payload = JSON.parse(fs.readFileSync(payload, 'utf-8'));
		}

		contentObj.Message = JSON.stringify(payload);

		return contentObj;
	}

	public static createSqsMessage(payload: any) {

		if (typeof payload === 'string') {
			payload = JSON.parse(fs.readFileSync(payload, 'utf-8'));
		}

		const fileContent = fs.readFileSync('./resources/sample_sqs_message_body.json', 'utf-8');
		let contentObj = JSON.parse(fileContent);
		contentObj.Records[0].body = JSON.stringify(payload);

		return contentObj;
	}

	public static createSqsMessageFromSns(payload: any) {

		let result = Helpers.createSnsMessage(payload);

		result = Helpers.createSqsMessage(result);

		return result;
	}

	public static async getAwsS3Base64Image(imageUrl: string, s3Region: string, s3Bucket: string): Promise<ServiceResult<string>> {

		let result = new ServiceResult<string>();

		let key = imageUrl;

		if (key.includes('.amazonaws.com')) {
			key = key.substr(key.indexOf('.amazonaws.com') + 15);
		}

		await new S3({
			region: s3Region
		}).getObject({

			Bucket: s3Bucket,
			Key: key

		}).promise()
			.then(async (data) => {

				let base64 = data.Body.toString('base64');
				const extension = imageUrl.substr(imageUrl.lastIndexOf('.') + 1);
				const padding = `data:image/${extension};base64,`;
				base64 = padding + base64;

				Log.info(`getAwsS3Base64Image Success; Length: ${base64.length}`);

				result.set(base64, true);

			}).catch((errS3) => {

				Log.error('getAwsS3Base64Image Error', key, errS3);
				result.error(errS3);
			});

		return result;
	}
}