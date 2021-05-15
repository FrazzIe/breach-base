import { Db } from "mongodb";
import Connector from "./connector";
import DbCreate from "./crud/create";
import DbRead from "./crud/read";
import DbUpdate from "./crud/update";
import DbDelete from "./crud/delete";

let database: Db = null;

type DBOptions = [Db, typeof DbCreate.Insert, typeof DbRead.Find, typeof DbUpdate.Update, typeof DbDelete.Delete];

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

export default async function Init(): Promise<DBOptions> {
	await Connector.Connect().then(OnConnectSuccess).catch(OnConnectError);

	return [database, DbCreate.Insert, DbRead.Find, DbUpdate.Update, DbDelete.Delete];
}