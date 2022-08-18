import { EntityManager, Repository, ObjectType, FindManyOptions } from "typeorm";
import { Database } from "../database";

export class BaseRepository<T> extends Repository<T> {

	public async save<T>(entity: T) {

		const manager = await this.getManager();
		return await manager.save(entity);
	}

	public async remove<T>(entity: T) {

		const manager = await this.getManager();
		return await manager.remove(entity);
	}

	private async getManager(): Promise<EntityManager> {
		return await Database.getManager();
	}
}