export interface IExternalLog
{
	setup(logType?: string);
	info(message: any);
	warn(message: any);
	error(message: any);
	fatal(message: any);
	flush();
}