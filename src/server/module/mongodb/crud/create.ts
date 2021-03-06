import { Collection, CollectionInsertManyOptions, CollectionInsertOneOptions, Db, InsertOneWriteOpResult, InsertWriteOpResult, ObjectId } from "mongodb";
import { Wait } from "../../../../shared/utils";
import DbMain from "./main";

interface IInsertParams {
	collection: string;
	document: {} | Array<{}>;
	options?: CollectionInsertOneOptions | CollectionInsertManyOptions;
}

interface IInsertCallback {
	(success: number, count: number, insertedId: ObjectId | { [key: number]: any; }): void;
}

class DbCreate extends DbMain {
	/**
	 * Initialise class members
	 * @constructor
	 */
	constructor() {
		super();

		const Exports = (global as any).exports;

		//Create exports
		Exports("insert", this.Insert);
		Exports("insertOne", this.Insert);
		Exports("insertMany", this.Insert);
	}

	/**
	 * Insert one or more documents into a collection
	 * @param {IInsertParams} params The insert object
	 * @param {string} params.collection The MongoDB collection name
	 * @param {{} | Array<{}>} params.document MongoDB documents to be inserted
	 * @param {IInsertCallback} callback The callback object
	 * @returns {Promise<void>} Empty promise
	 */
	public async Insert(params: IInsertParams, callback?: IInsertCallback): Promise<void> {
		if (!this.initialised) {
			while (!this.initialised) {
				await Wait(10);
			}
		}

		if (!params.collection) {
			console.warn("MongoDB couldn't find collection in params");
			return;
		}

		if (!params.document) {
			console.warn("MongoDB couldn't find document(s) in params");
			return;
		}

		const collection: Collection = this.database.collection(params.collection);
		const insertMany: boolean = Array.isArray(params.document);

		if (insertMany) {
			const insert: InsertWriteOpResult<any> = await collection.insertMany(params.document as Array<{}>, params.options);

			if (callback)
				callback(insert.result.ok, insert.insertedCount, insert.insertedIds);
			return;
		}

		const insert: InsertOneWriteOpResult<any> = await collection.insertOne(params.document, params.options);

		if (callback)
			callback(insert.result.ok, insert.insertedCount, insert.insertedId);
		return;
	}
}

export default new DbCreate();