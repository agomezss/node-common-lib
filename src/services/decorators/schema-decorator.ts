export function schema<T extends {new(...args:any[]):{}}>(constructor:T, schema: any) {

	return class extends constructor {
        _validationSchema = schema;
    }
}