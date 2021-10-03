import { Repository, getConnection } from "typeorm";
import { UpdateColumnDto } from "../dto/db.dto";

export class DbHelper {
    async get(repository: Repository<any>, options: any) {
        try {
            return await repository.findOne(options);
        } catch(err) {
            throw err;
        }
    }
    
    async getAll(repository: Repository<any>, options: any) {
        try {
            return await repository.find(options);
        } catch(err) {
            throw err;
        }
    }

    async set(repository: Repository<any>, entity: any) {
        try {
            return await repository.insert(entity);
        } catch(err) {
            throw err;
        }
    }

    async update(entity: any, options: UpdateColumnDto) {
        try {
            await getConnection()
            .createQueryBuilder()
            .update(entity)
            .set(options.setOptions)
            .where(`${options.columnName} = :${options.columnName}`,
            options.whereOptions)
            .execute()
        } catch(err) {
            throw err;
        }
    }

    async delete(repository: Repository<any>, options: any) {
        try {
            await repository.delete(options);
        } catch(err) {
            throw err;
        }
    }
}