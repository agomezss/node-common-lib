export class SnsTopicBaseMessage {

	id: string;

	// Example 2019-09-11T12:12:12-03:00
	timestamp: string;

	source: string;
	headers: Array<any>;
	domain: string;
	action: string;
	metadata: any;
	payload: any;

}