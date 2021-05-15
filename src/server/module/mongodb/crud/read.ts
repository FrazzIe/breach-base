import { Collection, Cursor, FilterQuery, FindOneOptions, WithoutProjection } from "mongodb";
import { Wait } from "../../../../shared/utils";
import DbMain from "./main";

interface IFindParams {
	collection: string;
	filter: FilterQuery<any>;
	options?: WithoutProjection<FindOneOptions<any>> | FindOneOptions<any>
}

interface IFindCallback {
	(result: any): void;
}

class DbRead extends DbMain {
	/**
	 * Initialise class members
	 * @constructor
	 */
	constructor() {
		super();
	}

	public async Find(params: IFindParams, callback?: IFindCallback, one: boolean = false): Promise<void> {
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

		if (one) {
			const find: any = await collection.findOne(params.filter, params.options);

			if (callback)
				callback(find);
			return;
		}

		const find: Cursor<any> = await collection.find(params.filter, params.options);
		const result: Array<any> = await find.toArray();

		if (callback)
			callback(result);
	}
}

export default new DbRead();