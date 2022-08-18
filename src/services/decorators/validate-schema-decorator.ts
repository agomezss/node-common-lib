import { SchemaValidator } from "../schema-validation/schema-validator";

export function validateSchema(schema) {

	return function (target, key, descriptor) {

		const validation = SchemaValidator.validate(descriptor, schema);

		if (!validation.isValid)
			throw new Error(validation.errors.toString());
	}
}