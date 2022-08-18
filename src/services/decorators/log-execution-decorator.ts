import { Log } from "../logging/log";

export function logExecution() {

	return function (target, key, descriptor) {

		const originalMethod = descriptor.value;

		descriptor.value = function (...args) {

			try {

				Log.info(`Executing ${key}..`);
				return originalMethod.apply(this, args);

			} finally {
				Log.info(`Execution terminated: ${key}`);
			}
		}

		return descriptor;
	}
}