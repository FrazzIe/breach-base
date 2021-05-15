import { Collection, CommonOptions, DeleteWriteOpResultObject, FilterQuery } from "mongodb";
import { Wait } from "../../../../shared/utils";
import DbMain from "./main";

interface IDeleteParams {
	collection: string;
	filter: FilterQuery<any>;
	options?: CommonOptions | CommonOptions & { bypassDocumentValidation?: boolean; }
}

interface IDeleteCallback {
	(success: number, deletedCount: number): void;
}

class DbDelete extends DbMain {
	/**
	 * Initialise class members
	 * @constructor
	 */
	constructor() {
		super();

		const Exports = (global as any).exports;

		//Create exports
		Exports("delete", this.Delete);
		Exports("deleteOne", this.Delete);
		Exports("deleteMany", (params: IDeleteParams, callback?: IDeleteCallback) => this.Delete(params, callback, true));
	}

	/**
	 * Deletes one or more matched documents in a collection
	 * @param {IDeleteParams} params The delete object
	 * @param {string} params.collection The MongoDB collection name
	 * @param {FilterQuery<any>} params.filter MongoDB filter query
	 * @param {CommonOptions | CommonOptions & { bypassDocumentValidation?: boolean; }} params.options MongoDB delete options
	 * @param {IDeleteCallback} callback The callback object
	 * @param {boolean} many Whether to use deleteMany or deleteOne
	 * @returns {Promise<void>} Empty promise
	 */
	public async Delete(params: IDeleteParams, callback?: IDeleteCallback, many: boolean = false): Promise<void> {
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

		const collection: Collection = this.database.collection(params.collection);

		if (many) {
			const _delete: DeleteWriteOpResultObject = await collection.deleteMany(params.filter,  params.options);

			if (callback)
				callback(_delete.result.ok, _delete.deletedCount);
			return;
		}

		const _delete: DeleteWriteOpResultObject = await collection.deleteOne(params.filter, params.options);

		if (callback)
			callback(_delete.result.ok, _delete.deletedCount);
		return;
	}
}

export default new DbDelete();