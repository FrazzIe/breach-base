import { Db } from "mongodb";
import Connector from "./connector";
import DbCreate from "./crud/create";
import DbRead from "./crud/read";
import DbUpdate from "./crud/update";
import DbDelete from "./crud/delete";

let database: Db = null;

export interface DbOptions {
	database: Db,
	insert: typeof DbCreate.Insert,
	find: typeof DbRead.Find,
	update: typeof DbUpdate.Update,
	delete: typeof DbDelete.Delete,
}

function OnConnectSuccess(result: boolean) {
	database = Connector.Database;
	DbCreate.Init(database, result);
	DbRead.Init(database, result);
	DbUpdate.Init(database, result);
	DbDelete.Init(database, result);
}

function OnConnectError(error: Error) {
	console.error(`MongoDB ${error.message}`);
}

export default async function Init(): Promise<DbOptions> {
	await Connector.Connect().then(OnConnectSuccess).catch(OnConnectError);

	return { database: database, insert: DbCreate.Insert, find: DbRead.Find, update: DbUpdate.Update, delete: DbDelete.Delete };
}