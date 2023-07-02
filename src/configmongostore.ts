import * as mongoDB from "mongodb";
import { Config, ConfigColdStore } from "redstreak";
import { MongoStore } from "./mongostore";

export class ConfigMongoStore<T extends Config> extends MongoStore<T> implements ConfigColdStore<T, mongoDB.UpdateFilter<T>> {
    async find(version: Config["version"]): Promise<T | undefined> {
        return await this.collection.findOne(
            { version } as mongoDB.Filter<T>,
            { _id: 0 } as mongoDB.FindOptions<T>
        ) as T;
    }

    async findAll(): Promise<T[]> {
        return await this.collection.find({}, { _id: 0 } as mongoDB.FindOptions<T>).toArray() as T[];
    }

    async remove(version: Config["version"]): Promise<void> {
        await this.collection.deleteOne({ version } as mongoDB.Filter<T>);
    }

    async insert(config: T): Promise<void> {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await this.collection.insertOne(config as any);
    }

    async update(version: Config["version"], query: mongoDB.UpdateFilter<T>): Promise<void> {
        await this.collection.updateOne(
            { version } as mongoDB.Filter<T>,
            query
        );
    }

    async updateField<K extends keyof T>(version: Config["version"], field: K, value: T[K]): Promise<void> {
        await this.collection.updateOne(
            { version } as mongoDB.Filter<T>,
            { $set: { [field]: value } } as mongoDB.UpdateFilter<T>
        );
    }
}