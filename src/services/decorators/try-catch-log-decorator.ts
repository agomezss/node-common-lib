import { Log } from "../logging/log";
import { Helpers } from "../helpers/general.helpers";

export function tryCatchLog(localHandler: any = null) {

	return function (target, key, descriptor) {

		const originalMethod = descriptor.value;

		descriptor.value = function (...args) {

			try {

				Log.info(`Executing ${key}..`);
				return originalMethod.apply(this, args);

			} catch (error) {

				if (localHandler) {
					localHandler.call(null, error, this);
				} else {
					Log.error(Helpers.stringify(error));
					throw error;
				}
			} finally {
				Log.info(`Execution terminated: ${key}`);
			}
		}

		return descriptor;
	}
}