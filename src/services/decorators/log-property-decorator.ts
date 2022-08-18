import { Log } from "../logging/log";

export function logProperty(target: any, key: string) {

	let value;

	const getter = function () {
		Log.info(`Get => ${key}`);
		return value;
	};

	const setter = function (newVal) {
		Log.info(`Set: ${key} => ${newVal}`);
		value = newVal;
	};

	Object.defineProperty(target, key, {
		get: getter,
		set: setter,
		enumerable: true,
		configurable: true
	});
}