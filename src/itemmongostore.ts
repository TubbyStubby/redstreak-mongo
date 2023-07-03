import * as mongoDB from "mongodb";
import { ItemColdStore, Item } from "redstreak";
import { MongoStore } from "./mongostore";

export class ItemMongoStore<T extends Item> extends MongoStore<T> implements ItemColdStore<T, mongoDB.UpdateFilter<T>> {
    async find(id: number): Promise<T | undefined> {
        return await this.collection.findOne(
            { id } as mongoDB.Filter<T>,
            { projection: { _id: 0 } }
        ) as T;
    }

    async findAll(): Promise<T[]> {
        return await this.collection.find(
            {},
            { projection: { _id: 0 } }
        ).toArray() as T[];
    }

    async remove(id: Item["id"]): Promise<void> {
        await this.collection.deleteOne({ id } as mongoDB.Filter<T>);
    }

    async insert(item: T): Promise<void> {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await this.collection.insertOne(item as any);
    }

    async update(id: Item["id"], query: mongoDB.UpdateFilter<T>): Promise<void> {
        await this.collection.updateOne(
            { id } as mongoDB.Filter<T>,
            query
        );
    }
}