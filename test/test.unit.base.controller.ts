
import { expect } from 'chai';
import { Log } from '../src/services/logging/log';
import * as dotenv from 'dotenv'
import { ok } from 'assert';
import { logExecution } from '../src/services/decorators/log-execution-decorator'
import { BaseController } from '../src/services/base/baseController'
import { ApiEvent, ApiContext, ApiCallback } from '../src/services/http/api.interfaces';
import { BusinessError } from '../src/services/exception/business-error'
import { HttpStatusCode } from '../src/services/http/http-status-codes';
import { Helpers } from '../src/services/helpers/general.helpers';
import { ServiceResult } from '../src/interfaces/ServiceResult';
import { SchemaValidationResult } from '../src/services/schema-validation/schemas/schema-validation-result';
import { ErrorCode } from '../src/services/http/error-codes';
import { ValidationError } from '../src/services/exception/validation-error';
const result = dotenv.config();

describe('The baseController', () => {

	it('Should handle business error correctly', () => {

		let error;
		let result;

		const customError = new BusinessError("Test Message", null, null, HttpStatusCode.Forbidden.toString());

		testControllerClass.getInstance().test(null, null, customError, (err,res) => {
			result = res;
			error = err;
		})

		expect(result).to.not.be.undefined;
		expect(result.body).to.not.be.undefined;
		expect(result.statusCode).to.not.be.undefined;
		expect(result.statusCode).to.be.equal(HttpStatusCode.Forbidden);
		expect(error).to.be.undefined;

		const body = JSON.parse(result.body);

		expect(body).to.not.be.undefined;
		expect(body.error).to.not.be.undefined;
		expect(body.error.code).to.not.be.undefined;
		expect(body.error.code).to.be.equal(BusinessError.name);

		const stringified = Helpers.stringify(result);
		expect(stringified).to.not.be.undefined;
		expect(stringified.indexOf(BusinessError.name) != -1).to.be.true;

	});

	it('Should handle custom error correctly', () => {

		let error;
		let result;

		const customError = new CustomError("Custom Error", HttpStatusCode.Forbidden.toString());

		testControllerClass.getInstance().test(null, null, customError, (err,res) => {
			result = res;
			error = err;
		})

		expect(result).to.not.be.undefined;
		expect(result.body).to.not.be.undefined;
		expect(result.statusCode).to.not.be.undefined;
		expect(result.statusCode).to.be.equal(HttpStatusCode.Forbidden);
		expect(error).to.be.undefined;

		const body = JSON.parse(result.body);

		expect(body).to.not.be.undefined;
		expect(body.error).to.not.be.undefined;
		expect(body.error.code).to.not.be.undefined;
		expect(body.error.code).to.be.equal(CustomError.name);

		const stringified = Helpers.stringify(result);
		expect(stringified).to.not.be.undefined;
		expect(stringified.indexOf(CustomError.name) != -1).to.be.true;


	});

	it('Should handle validation error correctly - using Model Validation', () => {

		let error;
		let result;

		const customError = new SchemaValidationResult();
		customError.isValid = false;
		customError.hasError = true;
		customError.errors = [{"error": "detail"}];

		testControllerClass.getInstance().test(null, null, customError, (err,res) => {
			result = res;
			error = err;
		})

		expect(result).to.not.be.undefined;
		expect(result.body).to.not.be.undefined;
		expect(result.statusCode).to.not.be.undefined;
		expect(result.statusCode).to.be.equal(HttpStatusCode.BadRequest);
		expect(error).to.be.undefined;

		const body = JSON.parse(result.body);

		expect(body).to.not.be.undefined;
		expect(body.error).to.not.be.undefined;
		expect(body.error.code).to.not.be.undefined;
		expect(body.error.description).to.not.be.undefined;
		expect(body.error.description.messages).to.not.be.undefined;
		expect(body.error.description.messages.length).to.be.equal(1);
		expect(body.error.code).to.be.equal(ErrorCode.InvalidData);

		const stringified = Helpers.stringify(result);
		expect(stringified).to.not.be.undefined;
		expect(stringified.indexOf(ErrorCode.InvalidData) != -1).to.be.true;
	});

	it('Should handle validation error correctly - using ValidationError', () => {

		let error;
		let result;

		const errors : any = [{"error": "detail"}];
		const customError = new ValidationError("Model invalid", errors);

		testControllerClass.getInstance().test(null, null, customError, (err,res) => {
			result = res;
			error = err;
		})

		expect(result).to.not.be.undefined;
		expect(result.body).to.not.be.undefined;
		expect(result.statusCode).to.not.be.undefined;
		expect(result.statusCode).to.be.equal(HttpStatusCode.BadRequest);
		expect(error).to.be.undefined;

		const body = JSON.parse(result.body);

		expect(body).to.not.be.undefined;
		expect(body.error).to.not.be.undefined;
		expect(body.error.code).to.not.be.undefined;
		expect(body.error.description).to.not.be.undefined;
		expect(body.error.description.messages).to.not.be.undefined;
		expect(body.error.description.messages.length).to.be.equal(1);
		expect(body.error.code).to.be.equal('ValidationError');

		const stringified = Helpers.stringify(result);
		expect(stringified).to.not.be.undefined;
		expect(stringified.indexOf('ValidationError') != -1).to.be.true;
		expect(stringified.indexOf('Model invalid') != -1).to.be.true;
		expect(stringified.indexOf('detail') != -1).to.be.true;
	});

});

export class testControllerClass extends BaseController {

	private static _instance: testControllerClass = new testControllerClass();

	public static getInstance(): testControllerClass {
		return this._instance;
	}

	public test(apiEvent: ApiEvent, apiContext: ApiContext, error: any, apiCallback: ApiCallback): void {

		testControllerClass._instance.handleExceptionAsHttp(error, apiCallback, testControllerClass._instance)
	}
}

export class CustomError extends BusinessError {
    constructor(message?: string, httpStatusCode? : string) {
        super(message, null, null, httpStatusCode);
        super.name = this.constructor.name;
    }
}