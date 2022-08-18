import { Logzio } from "./log.external.logzio";
import { IExternalLog } from "./interface.log.external";

export class ExternalLogFactory {

	public static make(): IExternalLog {
		if (process.env.EXTERNAL_LOG_PROVIDER &&
			process.env.EXTERNAL_LOG_PROVIDER === 'LOGZIO') {

			const logProvider = new Logzio();
			logProvider.setup();
			return logProvider;
		}

		return null;
	}
}