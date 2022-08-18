
import { createConnection, Connection, QueryRunner, EntityManager, ConnectionOptions } from 'typeorm';
import { Log } from '../services/logging/log';
import { InfrastructureError } from '../services/exception/infrastructure-error';
import { ApplicationError } from '../services/exception/application-error';

export class Database {

	private static _connection: Connection;
	private static _queryRunner: QueryRunner;
	private static _isInTestMode: boolean = false;
	private static _instance: Database;
	private static _isTransactioned: boolean = false;
	private static _isReleased: boolean = false;
	private static _rollbackOnCommit: boolean = true;
	private static _connectionSettings: any = null;

	public static isReleased(): boolean {
		return Database._isReleased;
	}

	public static isTransactioned(): boolean {
		return Database._isTransactioned;
	}

	public static setConnection(settings: any) {
		Database._connectionSettings = settings;
	}

	public static async initialize(): Promise<Database> {
		try {
			if (!Database._instance || !Database._connection || (Database._connection && !Database._connection.isConnected)) {
				const connectionToUse = process.env.DB_DEFALT_CONNECTION || "default";

				if (Database._connection && !Database._connection.isConnected)
					Database._connection = await Database._connection.connect();
				else if (Database._connectionSettings)
					Database._connection = await createConnection(Database._connectionSettings as ConnectionOptions);
				else
					Database._connection = await createConnection(connectionToUse);

				Database._isTransactioned = false;
				Database._isReleased = false;
				Database._instance = new Database();
			}

			return Database._instance;

		} catch (error) {
			Log.fatal("Database inicialization error", error);
			throw new InfrastructureError(error);
		}
	}

	public static async getConnection(): Promise<Connection> {
		try {
			await Database.initialize();
			return Database._connection;
		} catch (error) {
			Log.fatal("Database connection error", error);
			throw new InfrastructureError(error);
		}
	}

	public static async beginTransaction(): Promise<void> {
		try {
			if (Database._isTransactioned) return;
			const qr = await Database.getQueryRunner();
			Database._isInTestMode ? await qr.startTransaction("READ UNCOMMITTED") : await qr.startTransaction();
			Database._isTransactioned = true;
			Database._isReleased = false;
		} catch (error) {
			Log.error("Database begin transaction error", error);
			throw new ApplicationError(error);
		}
	}

	public static async commitTransaction(releaseConnection: boolean = true): Promise<void> {
		try {
			if (!Database._isTransactioned) return;

			if (Database._isInTestMode) {
				if (Database._rollbackOnCommit) await Database.rollbackTransaction(releaseConnection);
				return;
			}

			const qr = await Database.getQueryRunner();
			await qr.commitTransaction();
			Database._isTransactioned = false;

			if (releaseConnection) {
				await qr.release();
				Database._isReleased = true;
				await Database.close();
			}
		} catch (error) {
			Log.error("Database commit transaction error", error);
			throw new ApplicationError(error);
		}
	}

	public static async rollbackTransaction(releaseConnection: boolean = true): Promise<void> {
		try {
			const qr = await Database.getQueryRunner();
			await qr.rollbackTransaction();
			Database._isTransactioned = false;

			if (releaseConnection) {
				await qr.release();
				Database._isReleased = true;
				await Database.close();
			}
		} catch (error) {
			Log.error("Database rollback transaction error", error);
			throw new ApplicationError(error);
		}
	}

	public static setTestMode(testMode: boolean = true, rollbackOnCommit: boolean = true): void {
		Database._isInTestMode = testMode;
		Database._rollbackOnCommit = rollbackOnCommit;
	}

	public static async getManager(): Promise<EntityManager> {
		try {
			const runner = await Database.getQueryRunner();
			return runner.manager;
		} catch (error) {
			Log.fatal("Database connection error", error);
			throw new ApplicationError(error);
		}
	}

	public static async close(): Promise<void> {
		try {
			if (Database._connection && Database._connection.isConnected) {
				await Database._connection.close();
			}

			Database._queryRunner = null;
			Database._instance = null;
			Database._isTransactioned = false;
			Database._isReleased = true;
		} catch (error) {
			Log.fatal("Database close connection error", error);
		}
	}

	public static async getQueryRunner(): Promise<QueryRunner> {
		try {

			if (Database._connection && !Database._connection.isConnected) {
				await Database.close();
			}

			if (!Database._instance) {
				await this.initialize();
			}

			if (!Database._queryRunner ||
				(Database._queryRunner && Database._queryRunner.isReleased)) {
				Database._queryRunner = Database._connection.createQueryRunner();
			}

			return Database._queryRunner;
		} catch (error) {
			Log.fatal("Database connection error", error);
			throw new ApplicationError(error);
		}
	}
}