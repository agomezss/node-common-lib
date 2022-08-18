
import { expect } from 'chai';
import { Log } from '../src/services/logging/log';
import * as dotenv from 'dotenv'
import { ok } from 'assert';
import { logExecution } from '../src/services/decorators/log-execution-decorator'
const result = dotenv.config();

describe('The logExecution decorator', () => {

	it('Work syncronously on synchronous functions', () => {

		const result = testDecoratorClass.testLogSync();
		expect(result).to.be.equal("ok");

	});

	it('Work asyncronously on asynchronous functions', async () => {

		const result = await testDecoratorClass.testLogAsync();
		expect(result).to.be.equal("ok");

	});

});

export class testDecoratorClass {

	@logExecution()
	public static testLogSync() {
		return "ok";
	}

	@logExecution()
	public static async testLogAsync() : Promise<any> {
		return "ok";
	}

}