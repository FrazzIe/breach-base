import { Db } from "mongodb";
import DbConnector from "./module/mongodb/index";
import QueueManager from "./module/queue/index";

async function Init() {
	const db: Db = await DbConnector();
	QueueManager(db);
}

setImmediate(Init);