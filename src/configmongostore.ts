import * as mongoDB from "mongodb";
import { Config, ConfigColdStore } from "redstreak";
import { MongoStore } from "./mongostore";

export class ConfigMongoStore<T extends Config> extends MongoStore<T> implements ConfigColdStore<T, mongoDB.UpdateFilter<T>> {
    async find(version: Config["version"]): Promise<T | undefined> {
        return await this.collection.findOne(
            { version } as mongoDB.Filter<T>,
            { projection: { _id: 0 } }
        ) as T;
    }

    async findAll(): Promise<T[]> {
        return await this.collection.find(
            {},
            { projection: { _id: 0 } }
        ).toArray() as T[];
    }

    async remove(version: Config["version"]): Promise<void> {
        await this.collection.deleteOne({ version } as mongoDB.Filter<T>);
    }

    async insert(config: T): Promise<void> {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await this.collection.insertOne(config as any);
    }

    async updateField<K extends keyof T>(version: Config["version"], field: K, value: T[K]): Promise<void> {
        await this.collection.updateOne(
            { version } as mongoDB.Filter<T>,
            { $set: { [field]: value } } as mongoDB.UpdateFilter<T>
        );
    }

    async updateFields(version: number, values: { [K in keyof T]: T[K]; }): Promise<void> {
        await this.collection.updateOne(
            { version } as mongoDB.Filter<T>,
            { $set: values }
        )
    }

    async flipStatus(versions: number[]): Promise<void>;
    async flipStatus(...versions: number[]): Promise<void>;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async flipStatus(...versions: any): Promise<void> {
        await this.collection.updateMany(
            { version: { $in: versions } } as mongoDB.Filter<T>,
            // TODO: fix typings
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            <any>{ $bit: { status: { xor: 1 } } }
        )
    }
}