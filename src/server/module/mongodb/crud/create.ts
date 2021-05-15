import { Collection, Db, InsertOneWriteOpResult, InsertWriteOpResult, ObjectId } from "mongodb";
import { Wait } from "../../../../shared/utils";

interface IParams {
	collection: string;
	document: {} | Array<{}>;
	options?: {};
}

interface ICallback {
	(success: number, count: number, insertedId: ObjectId | { [key: number]: any; }): void;
}

class DbCreate {
	private initialised: boolean;
	private database: Db;

	/**
	 * Initialise class members
	 * @constructor
	 */
	constructor() {
		this.initialised = false;
		this.database = null;
	}

	/**
	 * Sets the database and connection status
	 * @param _database Database instance
	 * @param _initialised Connection result
	 */
	public Init(_database: Db, _initialised: boolean): void {
		this.database = _database;
		this.initialised = _initialised;
	}

	/**
	 * Insert one or more documents into a collection
	 * @param {IParams} params The insert object
	 * @param {string} params.collection The MongoDB collection name
	 * @param {{} | Array<{}>} params.document MongoDB documents to be inserted
	 * @param {ICallback} callback The callback object
	 * @returns {Promise<void>} Empty promise
	 */
	public async Insert(params: IParams, callback?: ICallback): Promise<void> {
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