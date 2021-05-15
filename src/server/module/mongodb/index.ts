import { Db } from "mongodb";
import Connector from "./connector";
import DbCreate from "./crud/create";
import DbUpdate from "./crud/update";

let database: Db = null;

function OnConnectSuccess(result: boolean) {
	database = Connector.Database;
	DbCreate.Init(database, result);
	DbUpdate.Init(database, result);
	console.log("OK");
}

function OnConnectError(error: Error) {
	console.error(`MongoDB ${error.message}`);
}

export default async function Init(): Promise<Db> {
	await Connector.Connect().then(OnConnectSuccess).catch(OnConnectError);

	return database;
}