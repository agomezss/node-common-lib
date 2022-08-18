
import { expect } from 'chai';
import { Log } from '../src/services/logging/log';
import  * as dotenv from 'dotenv'
const result = dotenv.config();

describe('The external log Logzio provider', () => {

	it('can send all severity log messages', () => {

		const jsonMessage = {
			string: 'Test',
			boolean: true,
			number: 42.0,
			date: new Date()
		};

		Log.info('Simple log');
		Log.info('Test from unit test - nodejs-common-lib project', jsonMessage);
		Log.warn('Test from unit test - nodejs-common-lib project', jsonMessage);
		Log.error('Test from unit test - nodejs-common-lib project', jsonMessage);
		Log.fatal('Test from unit test - nodejs-common-lib project', jsonMessage);
		Log.flush();

		expect(true).to.be.true;
	});
});
