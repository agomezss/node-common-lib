
export const eventMessageSchema = {

	"definitions": {},
	"$schema": "http://json-schema.org/draft-07/schema#",
	"$id": "https://nodejs-common-lib/schemas/eventMessage",
	"type": "object",
	"title": "Schema for nodejs-common-lib exportCustomer message payload",
	"required": [
	  "id",
	  "timestamp",
	  "source",
	  "domain",
	  "action",
	  "payload"
	],
	"properties": {
	  "id": {
		"$id": "#/properties/id",
		"type": "string",
		"title": "The Id Schema",
		"default": "",
		"examples": [
		  "8ca9d5b2-185e-4918-aa6a-8cef0884ebdc"
		],
		"pattern": "^(.*)$"
	  },
	  "timestamp": {
		"$id": "#/properties/timestamp",
		"type": "string",
		"title": "The Timestamp Schema",
		"default": "",
		"examples": [
		  "2019-07-08T14:29:08.322Z"
		],
		"pattern": "^(.*)$"
	  },
	  "source": {
		"$id": "#/properties/source",
		"type": "string",
		"title": "The Source Schema",
		"default": "",
		"examples": [
		  "account-core"
		],
		"pattern": "^(.*)$"
	  },
	  "headers": {
		"$id": "#/properties/headers",
		"type": "null",
		"title": "The Headers Schema",
		"default": null,
		"examples": [
		  null
		]
	  },
	  "domain": {
		"$id": "#/properties/domain",
		"type": "string",
		"title": "The Domain Schema",
		"default": "",
		"examples": [
		  "account"
		],
		"pattern": "^(.*)$"
	  },
	  "action": {
		"$id": "#/properties/action",
		"type": "string",
		"title": "The Action Schema",
		"default": "",
		"examples": [
		  "nodejs-common-lib-customer-created"
		],
		"pattern": "^(.*)$"
	  },
	  "metadata": {
		"$id": "#/properties/metadata",
		"type": "null",
		"title": "The Metadata Schema",
		"default": null,
		"examples": [
		  null
		]
	  },
	  "payload": {
		"$id": "#/properties/payload",
		"type": "object",
		"title": "The Payload Schema"
	  }
	}
  }