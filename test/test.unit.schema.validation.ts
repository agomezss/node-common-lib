
import { expect } from 'chai';
import { SchemaValidator } from '../src/services/schema-validation/schema-validator'

describe('The SchemaValidator', () => {

	it('can validate an event message', () => {

		const result = SchemaValidator.validateEventMessage(mockEventMessageForSchema);
		expect(result.hasError).to.be.false;
	});
});

const mockEventMessageForSchema = {
	"id": "8ca9d5b2-185e-4918-aa6a-8cef0884ebdc",
	"timestamp": "2019-07-08T14:29:08.322Z",
	"source": "nodejs-common-lib",
	"headers": null,
	"domain": "COMMON",
	"action": "SCHEMA_VALIDATION",
	"metadata": null,
	"payload": {}
}