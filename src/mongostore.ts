import * as mongoDB from "mongodb";

interface MongoStoreBaseOtions {
    dbName: string;
    collectionName: string;
}

interface MongoStoreUrlOtions extends MongoStoreBaseOtions {
    url: string;
    client?: never;
}
interface MongoStoreClientOtions extends MongoStoreBaseOtions {
    client: mongoDB.MongoClient;
    url?: never;
}

type MongoStoreOptions = MongoStoreClientOtions | MongoStoreUrlOtions;

export class MongoStore<T extends mongoDB.BSON.Document> {
    #client; #db; #collection;
    
    constructor(options: MongoStoreOptions) {
        if(options.client) {
            this.#client = options.client;
        } else if(options.url) {
            this.#client = new mongoDB.MongoClient(options.url);
        } else {
            throw new Error("Client or Url required to initialize");
        }
        this.#db = this.#client.db(options.dbName);
        this.#collection = this.#db.collection<T>(options.collectionName);
    }

    get client() { return this.#client; }
    get db() { return this.#db; }
    get collection() { return this.#collection; }
}