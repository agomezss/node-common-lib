import { Log } from "../logging/log";
import { Helpers } from "../helpers/general.helpers";

export function tryCatch(localHandler: any = null) {

	return function (target, key, descriptor) {

		const originalMethod = descriptor.value;

		descriptor.value = function (...args) {

			try {

				return originalMethod.apply(this, args);

			} catch (error) {

				if (localHandler) {
					localHandler.call(null, error, this);
				} else {
					Log.error(Helpers.stringify(error));
					throw error;
				}
			}
		}

		return descriptor;
	}
}