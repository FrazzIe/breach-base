import { DbOptions } from "./module/mongodb/index";
import DbConnector from "./module/mongodb/index";

async function Init() {
	const dbOptions: DbOptions = await DbConnector();
}

setImmediate(Init);