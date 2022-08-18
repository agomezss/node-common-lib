export function measureExecution(target: any, propertyKey: string, descriptor: PropertyDescriptor): any {
	const originalMethod = descriptor.value;

	descriptor.value = function (...args) {
		const start = new Date().getTime();
		const result = originalMethod.apply(this, args);
		var elapsed = new Date().getTime() - start;
		console.log(`Call to ${propertyKey} took ${elapsed} milliseconds.`);
		return result;
	};

	return descriptor;
}