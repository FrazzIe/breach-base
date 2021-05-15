import DbMain from "./main";
import { Wait } from "../../../../shared/utils";
import { Collection, FilterQuery, ObjectId, UpdateManyOptions, UpdateOneOptions, UpdateQuery, UpdateWriteOpResult } from "mongodb";

interface IUpdateParams {
	collection: string;
	filter: FilterQuery<any>;
	update: UpdateQuery<any> | Partial<any>;
	options?: UpdateOneOptions | UpdateManyOptions;
}

interface IUpdateCallback {
	(success: number, matchedCount: number, modifiedCount: number, upsertedCount: number, upsertedId?: { _id: ObjectId }): void;
}

class DbUpdate extends DbMain {
	/**
	 * Initialise class members
	 * @constructor
	 */
	constructor() {
		super();

		const Exports = (global as any).exports;

		//Create exports
		Exports("update", this.Update);
		Exports("updateOne", this.Update);
		Exports("updateMany", (params: IUpdateParams, callback?: IUpdateCallback) => this.Update(params, callback, true));
	}

	/**
	 * Updates one or more matched documents in a collection
	 * @param {IUpdateParams} params The update object
	 * @param {string} params.collection The MongoDB collection name
	 * @param {FilterQuery<any>} params.filter MongoDB filter query
	 * @param {UpdateQuery<any> | Partial<any>} params.update MongoDB update query
	 * @param {UpdateOneOptions | UpdateManyOptions} params.options MongoDB update options
	 * @param {IUpdateCallback} callback The callback object
	 * @param {boolean} many Whether to use updateMany or updateOne
	 * @returns {Promise<void>} Empty promise
	 */
	public async Update(params: IUpdateParams, callback?: IUpdateCallback, many: boolean = false): Promise<void> {
		if (!this.initialised) {
			while (!this.initialised) {
				await Wait(10);
			}
		}

		if (!params.collection) {
			console.warn("MongoDB couldn't find collection in params");
			return;
		}

		if (!params.filter) {
			console.warn("MongoDB couldn't find filter query in params");
			return;
		}

		if (!params.update) {
			console.warn("MongoDB couldn't find update query in params");
			return;
		}

		const collection: Collection = this.database.collection(params.collection);

		if (many) {
			const update: UpdateWriteOpResult = await collection.updateMany(params.filter, params.update, params.options);

			if (callback)
				callback(update.result.ok, update.matchedCount, update.modifiedCount, update.upsertedCount, update.upsertedId);
			return;
		}

		const update: UpdateWriteOpResult = await collection.updateOne(params.filter, params.update, params.options);

		if (callback)
			callback(update.result.ok, update.matchedCount, update.modifiedCount, update.upsertedCount, update.upsertedId);
		return;
	}
}

export default new DbUpdate();