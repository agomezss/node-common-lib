import { IExternalLog } from "./external/interface.log.external";
import { ExternalLogFactory } from "./external/log.external.factory";
export class Log {

	private static _externalLog: IExternalLog;

	private static setupExternal(): void {

		if (!Log._externalLog) {
			Log._externalLog = ExternalLogFactory.make();
		}
	}

	private static format(message: any): string {

		if (typeof message === 'object' &&
			message.length === 0)
			return '';

		if (typeof message === 'string')
			return message;

		if (typeof message === 'number' ||
			typeof message === 'boolean')
			return message.toString();

		return message;
	}

	private static formatMessage(message: any, ...params: any) {

		if(params && params.length == 1 && params[0].length == 0)
			return Log.format(message);

		let logObj: any = {};
		logObj['description'] = Log.format(message);
		let i = 1;

		params.forEach((param) => {
			logObj[`args_${i}`] = Log.format(param);
			i++;
		});

		return logObj;
	}

	public static info(message: any, ...params: any[]): void {

		Log.setupExternal();
		const formattedMessage: string = Log.formatMessage(message, params);
		console.info(formattedMessage);
		if (Log._externalLog) Log._externalLog.info(formattedMessage);
	}

	public static warn(message: any, ...params: any[]): void {

		Log.setupExternal();
		const formattedMessage: string = Log.formatMessage(message, params);
		console.warn(formattedMessage);
		if (Log._externalLog) Log._externalLog.warn(formattedMessage);
	}

	public static error(message: any, ...params: any[]): void {

		Log.setupExternal();
		const formattedMessage: string = Log.formatMessage(message, params);
		console.error(formattedMessage);
		if (Log._externalLog) Log._externalLog.error(formattedMessage);
	}

	public static fatal(message: any, ...params: any[]): void {

		Log.setupExternal();
		const formattedMessage: string = Log.formatMessage(message, params)
		console.error(formattedMessage);
		if (Log._externalLog) Log._externalLog.fatal(formattedMessage);
	}

	public static flush(): void {
		if (Log._externalLog) Log._externalLog.flush();
	}
}
