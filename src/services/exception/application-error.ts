
import { Helpers } from "../helpers/general.helpers";
import { HttpStatusCode } from "../http/http-status-codes";

export class ApplicationError extends Error {
	
	public messages: string[];
	public codes: string[];
	public httpStatusCode: string;

	
    constructor(message?: string, messages?: string[], codes?: string[], httpStatusCode? : string) {

		if(message && typeof message !== "string")
			message = Helpers.stringify(message);

        super(message);
        Object.setPrototypeOf(this, new.target.prototype);
		this.name = ApplicationError.name;
		this.messages = messages;
		this.codes = codes;
		this.httpStatusCode = httpStatusCode || HttpStatusCode.InternalServerError.toString();
    }
}