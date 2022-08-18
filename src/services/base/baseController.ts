import { ApiEvent, ApiCallback } from "../http/api.interfaces";
import { ResponseBuilder } from "../http/response-builder";
import { Log } from "../logging/log";
import { SchemaValidator } from "../schema-validation/schema-validator";
import { ValidationError } from "../exception/validation-error";
import { HttpStatusCode } from "../http/http-status-codes";
import { ErrorCode } from "../http/error-codes";
import { ServiceResult } from "../../interfaces/ServiceResult";
import { Helpers } from "../helpers/general.helpers";
import { Database } from "../../infrastructure/database";

export class BaseController {

	public validateModel(model: any, schema: any): void {

		try {
			Log.info('Validating request model');

			if (!model)
				throw new ValidationError("Missing model");

			if (!schema)
				throw new ValidationError("Missing schema");

			const validation = SchemaValidator.validate(model, schema);

			if (!validation.isValid)
				throw new ValidationError("Invalid schema", validation.errors);

		} catch (error) {
			const obj = new ServiceResult<any>();
			obj.error(error);
			Log.error('Model validation error', obj);
			throw obj;
		}
	}

	private getExceptionDetails(error: any): any {

		let errorCode = undefined;

		let httpStatusCode = error.message ?
			HttpStatusCode.InternalServerError.toString() :
			HttpStatusCode.BadRequest.toString();

		const body = error.errorObject ? error.errorObject : error;

		if (body.name)
			errorCode = body.name;

		if (body.httpStatusCode)
			httpStatusCode = body.httpStatusCode;

		const message = this.getErrorBody(body);

		return {
			errorCode,
			message,
			httpStatusCode
		}
	}

	public handleExceptionAsHttp(error: any, callback: ApiCallback, controller: BaseController): void {

		try {

			const errorDetails = this.getExceptionDetails(error);

			switch (errorDetails.httpStatusCode) {
				case HttpStatusCode.BadRequest.toString():
					return controller.badRequest(errorDetails.errorCode || ErrorCode.InvalidData.toString(),
						errorDetails.message,
						callback);
				case HttpStatusCode.BadGateway.toString():
					return controller.badGateway(errorDetails.errorCode || ErrorCode.InvalidData.toString(),
						errorDetails.message,
						callback);
				case HttpStatusCode.PreconditionFailed.toString():
					return controller.badRequest(errorDetails.errorCode || ErrorCode.ValidationFailed.toString(),
						errorDetails.message,
						callback);
				case HttpStatusCode.NotFound.toString():
					return controller.notFound(errorDetails.errorCode || ErrorCode.NotFound.toString(),
						errorDetails.message,
						callback);
				case HttpStatusCode.Unauthorized.toString():
					return controller.unauthorized(errorDetails.errorCode || ErrorCode.Unauthorized.toString(),
						errorDetails.message,
						callback);
				case HttpStatusCode.Forbidden.toString():
					return controller.forbidden(errorDetails.errorCode || ErrorCode.MissingPermission.toString(),
						errorDetails.message,
						callback);
				case HttpStatusCode.ConfigurationError.toString():
					return controller.badRequest(errorDetails.errorCode || ErrorCode.MissingConfiguration.toString(),
						errorDetails.message,
						callback);
				default:
					return controller.internalServerError(error, callback);
			}

		} catch (error) {
			return controller.internalServerError(error, callback);
		}
	}

	private getErrorBody(error: any): any {
		return {
			description: error.message || "UNKNOWN_ERROR",
			messages: error.messages || error.errors || {},
			codes: error.codes || {},
		}
	}

	public getRequest(baseObject: ApiEvent): any {

		try {

			let body = baseObject.body || baseObject;
			let sqsId;

			if (typeof body === 'string')
				body = JSON.parse(body);

			if (body.Records) {

				sqsId = body.Records[0].messageId;
				body = JSON.parse(body.Records[0].body);
			}

			if (body.Message) {

				body = JSON.parse(body.Message);
				body['originalSqsMessageId'] = sqsId;
			}

			if (body.payload) {

				if (body.originalSqsMessageId) {
					body.payload.originalSqsMessageId = body.originalSqsMessageId;
				}
			}

			return body;

		} catch (error) {

			Log.error("Error parsing request data", error);
			throw error;
		}
	}

	public getPrincipalId(request: any): string {

		return Helpers.getPrincipalId(request);
	}

	public ok<T>(result: T, callback: ApiCallback): void {
		Database.close();
		Log.info('Returning HTTP OK (200)', Helpers.stringify(result));
		ResponseBuilder.ok<T>(result, callback);
	}

	public created(callback: ApiCallback): void {
		Database.close();
		Log.info('Returning HTTP Created');
		ResponseBuilder.created(callback);
	}

	public noContent(callback: ApiCallback): void {
		Database.close();
		Log.info('Returning HTTP No Content');
		ResponseBuilder.noContent(callback);
	}

	public badRequest(code: string, description: string, callback: ApiCallback): void {
		Database.close();
		Log.error('Returning HTTP Bad Request', code, description);
		ResponseBuilder.badRequest(code, description, callback);
	}

	public badGateway(code: string, description: string, callback: ApiCallback): void {
		Database.close();
		Log.error('Returning HTTP Bad Gateway', code, description);
		ResponseBuilder.badGateway(code, description, callback);
	}

	public configurationError(code: string, description: string, callback: ApiCallback): void {
		Database.close();
		Log.error('Returning HTTP Configuration error', code, description);
		ResponseBuilder.configurationError(code, description, callback);
	}

	public forbidden(code: string, description: string, callback: ApiCallback): void {
		Database.close();
		Log.error('Returning HTTP Forbidden', code, description);
		ResponseBuilder.forbidden(code, description, callback);
	}

	public internalServerError(error: Error, callback: ApiCallback): void {
		Database.close();
		Log.error('Returning HTTP Internal Server Error', Helpers.stringify(error));
		ResponseBuilder.internalServerError(error, callback);
	}

	public notFound(code: string, description: string, callback: ApiCallback): void {
		Database.close();
		Log.error('Returning HTTP Not Found', code, description);
		ResponseBuilder.notFound(code, description, callback);
	}

	public unauthorized(code: string, description: string, callback: ApiCallback): void {
		Database.close();
		Log.error('Returning HTTP Unauthorized', code, description);
		ResponseBuilder.unauthorized(code, description, callback);
	}
}