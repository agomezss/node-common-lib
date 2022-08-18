export interface BaseRequest {

	id: string,
	timestamp: string,
	source: string,
	headers: Array<any>,
	domain: string,
	action: string,
	metadata: Array<any>
}