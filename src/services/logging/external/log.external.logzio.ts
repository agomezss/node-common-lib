import { IExternalLog } from './interface.log.external'
import * as logger from 'logzio-nodejs';
import { Helpers } from '../../helpers/general.helpers';

export class Logzio implements IExternalLog {

	private _logger: any;

	setup(logType?: string) {
		try {
			this._logger = logger.createLogger({
				token: process.env.EXTERNAL_LOG_API_KEY
				,
				type: logType ? logType :
					process.env.EXTERNAL_LOG_TYPE ? process.env.EXTERNAL_LOG_TYPE :
						'nodejs'
			});
		} catch (error) {
			console.error('Error setting up Logzio:' + Helpers.stringify(error));
		}
	}

	private log(message: any) {

		try {

			this._logger.log(message);

		} catch (error) {
			console.error('Error logging in Logzio:' + Helpers.stringify(error));
		}
	}

	private format(message: any): string {

		try {
			if (typeof message === 'object' &&
				message.length === 0)
				return '';

			if (typeof message === 'string')
				return message;

			if (typeof message === 'number' ||
				typeof message === 'boolean')
				return message.toString();

			return Helpers.stringify(message);

		} catch (error) {
			return "ERROR PARSING JSON AT LOGZIO PROVIDER";
		}
	}

	info(message: any) {
		const parsed = this.format(message);
		this.log({ message: parsed, severity: 'info' });
	}

	warn(message: any) {
		const parsed = this.format(message);
		this.log({ message: parsed, severity: 'warn' });
	}

	error(message: any) {
		const parsed = this.format(message);
		this.log({ message: parsed, severity: 'error' });
	}

	fatal(message: any) {
		const parsed = this.format(message);
		this.log({ message: parsed, severity: 'fatal' });
	}

	flush() {
		try {

			this._logger.sendAndClose();

		} catch (error) {

			console.error('Error flushing Logzio messages:' + Helpers.stringify(error));
		}
	}
}