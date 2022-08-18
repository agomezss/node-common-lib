
const Ajv = require('ajv');
import { ServiceResult } from '../../interfaces/ServiceResult';
import { eventMessageSchema } from './schemas/eventMessage.schema';
import { SchemaValidationResult } from './schemas/schema-validation-result';

export class SchemaValidator {

	public static isValid(data: any, schema: any): any {
		return SchemaValidator.validate(data, schema).isValid;
	}

	public static validate(data: any, schema: any): SchemaValidationResult {

		const validate = new Ajv().compile(schema);

		const isValid = validate(data);

		if (isValid) return { isValid: true, errors: null, hasError: false };

		return { isValid: false, errors: validate.errors, hasError: true };
	}

	public static validateMessage(data: any, schema: any): ServiceResult<any> {

		const validationResults : SchemaValidationResult = SchemaValidator.validate(data, schema);

		const result = new ServiceResult();

		if (validationResults.isValid) {

			result.set(true);

		} else {

			result.error(validationResults.errors);
		}

		return result;
	}

	public static validateEventMessage(data: any): ServiceResult<any> {

		return SchemaValidator.validateMessage(data, eventMessageSchema);
	}
}