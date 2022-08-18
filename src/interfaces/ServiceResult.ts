import { Log } from "../services/logging/log";

export class ServiceResultBase {

	hasError: boolean;
	errorObject: any;
}

export class ServiceResult<T> implements ServiceResultBase {

	hasError: boolean;
	errorObject: any;
	errorType: any;
	resultObject: T;

	constructor(resultObject?: T) {

		if (resultObject) {

			this.resultObject = resultObject;
		}
	}

	public set(resultObject: any, suppressConsoleInfo: boolean = true): ServiceResult<T> {

		this.hasError = false;
		this.resultObject = resultObject;
		delete this.errorObject;
		delete this.errorType;

		try {

			if (!suppressConsoleInfo) {
				Log.info('ServiceResult updated', this);
			}

		} catch (errLog) {

			Log.error('ServiceResult log error', errLog);
		}

		return this;
	}

	public error(errorObject: any, errorType: any = null): ServiceResult<T> {

		this.hasError = true;

		delete this.resultObject;

		if(errorType !== null)
			this.errorType = errorType;

		if (errorObject.hasError === true && errorObject.errorObject != null) {

			this.errorObject = errorObject.errorObject;
			Log.error(this.errorObject);

		} else {

			this.errorObject = errorObject;
			Log.error('ServiceResult error', this);
		}

		return this;
	}
}