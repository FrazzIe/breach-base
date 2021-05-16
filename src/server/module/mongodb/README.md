# MongoDB

Database connector module

## Server Convars
```c
# Credentials
set mongodb_username ""
set mongodb_password ""
# Auth database
set mongodb_authdb ""
# IP Address
set mongodb_host ""
# Port
set mongodb_port ""
# Database to use
set mongodb_db ""
```

## Exports

### Insert exports

```ts
interface IInsertParams {
	collection: string;
	document: {} | Array<{}>;
	options?: CollectionInsertOneOptions | CollectionInsertManyOptions;
}

interface IInsertCallback {
	(success: number, count: number, insertedId: ObjectId | { [key: number]: any; }): void;
}

/**
 * Insert one or more documents into a collection
 * @param {IInsertParams} params The insert object
 * @param {string} params.collection The MongoDB collection name
 * @param {{} | Array<{}>} params.document MongoDB documents to be inserted
 * @param {CollectionInsertOneOptions | CollectionInsertManyOptions} params.options MongoDB insert options
 * @param {IInsertCallback} callback The callback object
 */
exports["breach-base"].insert(params: IInsertParams, callback?: IInsertCallback);
exports["breach-base"].insertOne(params: IInsertParams, callback?: IInsertCallback);
exports["breach-base"].insertMany(params: IInsertParams, callback?: IInsertCallback);

/**
 * Example usage
 */
exports["breach-base"].insert({
	collection: "name",
	document: {	field: "value" }
}, function(success, count, insertedId) {
	console.log(`Success: ${success}, Count: ${count}, Id: ${insertedId}`);
});

/**
 * Example usage (insertMany)
 */
exports["breach-base"].insert({
	collection: "name",
	document: [
		{ field: "value" },
		{ field: "value2" },
	]
}, function(success, count, insertedId) {
	console.log(`Success: ${success}, Count: ${count}, Id: ${insertedId}`);
});
```

### Find exports

```ts
interface IFindParams {
	collection: string;
	filter: FilterQuery<any>;
	options?: WithoutProjection<FindOneOptions<any>> | FindOneOptions<any>
}

interface IFindCallback {
	(result: any): void;
}

/**
 * Finds one or more matched documents in a collection
 * @param {IFindParams} params The find object
 * @param {string} params.collection The MongoDB collection name
 * @param {FilterQuery<any>} params.filter MongoDB filter query
 * @param {WithoutProjection<FindOneOptions<any>> | FindOneOptions<any>} params.options MongoDB find options
 * @param {IFindCallback} callback The callback object
 * @param {boolean} one Whether to use findOne or find
 */
exports["breach-base"].find(params: IFindParams, callback?: IFindCallback, one: boolean = false);
exports["breach-base"].findOne(params: IFindParams, callback?: IFindCallback);
exports["breach-base"].findMany(params: IFindParams, callback?: IFindCallback, one: boolean = false);

/**
 * Example usage (findOne)
 */
exports["breach-base"].find({
	collection: "name",
	filter: { field: "value" },
}, function(results) {
	console.log(results);
}, true);

/**
 * Example usage (findMany)
 */
exports["breach-base"].find({
	collection: "name",
	filter: { field: "value" },
}, function(results) {
	console.log(results);
});
```

### Update exports

```ts
interface IUpdateParams {
	collection: string;
	filter: FilterQuery<any>;
	update: UpdateQuery<any> | Partial<any>;
	options?: UpdateOneOptions | UpdateManyOptions;
}

interface IUpdateCallback {
	(success: number, matchedCount: number, modifiedCount: number, upsertedCount: number, upsertedId?: { _id: ObjectId }): void;
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
 */
exports["breach-base"].update(params: IUpdateParams, callback?: IUpdateCallback, many: boolean = false);
exports["breach-base"].updateOne(params: IUpdateParams, callback?: IUpdateCallback, many: boolean = false);
exports["breach-base"].updateMany(params: IUpdateParams, callback?: IUpdateCallback);

/**
 * Example usage (updateOne)
 */
exports["breach-base"].update({
	collection: "name",
	filter: { field: "value" },
	update: {
		$set: {
			field: "value update",
		}
	},
}, function(success, matchedCount, modifiedCount, upsertedCount, upsertedId) {
	console.log(`s: ${success}, matc: ${matchedCount}, modc: ${modifiedCount}, uc: ${upsertedCount}`);
	console.log(upsertedId);
});

/**
 * Example usage (updateMany)
 */
exports["breach-base"].update({
	collection: "name",
	filter: { field: "value" },
	update: {
		$set: {
			field: "value update",
		}
	},
}, function(success, matchedCount, modifiedCount, upsertedCount, upsertedId) {
	console.log(`s: ${success}, matc: ${matchedCount}, modc: ${modifiedCount}, uc: ${upsertedCount}`);
	console.log(upsertedId);
}, true);
```

### Delete exports

```ts
interface IDeleteParams {
	collection: string;
	filter: FilterQuery<any>;
	options?: CommonOptions | CommonOptions & { bypassDocumentValidation?: boolean; }
}

interface IDeleteCallback {
	(success: number, deletedCount: number): void;
}

/**
 * Deletes one or more matched documents in a collection
 * @param {IDeleteParams} params The delete object
 * @param {string} params.collection The MongoDB collection name
 * @param {FilterQuery<any>} params.filter MongoDB filter query
 * @param {CommonOptions | CommonOptions & { bypassDocumentValidation?: boolean; }} params.options MongoDB delete options
 * @param {IDeleteCallback} callback The callback object
 * @param {boolean} many Whether to use deleteMany or deleteOne
 */
exports["breach-base"].delete(params: IDeleteParams, callback?: IDeleteCallback, many: boolean = false);
exports["breach-base"].deleteOne(params: IDeleteParams, callback?: IDeleteCallback, many: boolean = false);
exports["breach-base"].deleteMany(params: IDeleteParams, callback?: IDeleteCallback);

/**
 * Example usage (deleteOne)
 */
exports["breach-base"].delete({
	collection: "name",
	filter: { field: "value" },
}, function(success, count) {
	console.log(`s: ${success}, num: ${count}`);
});

/**
 * Example usage (deleteOne)
 */
exports["breach-base"].delete({
	collection: "name",
	filter: { field: "value" },
}, function(success, count) {
	console.log(`s: ${success}, num: ${count}`);
}, true);
```