import { Db } from "mongodb";
import DbConnector from "./module/mongodb/index";

async function Init() {
	const DbInstance: Db = await DbConnector();
}

setImmediate(Init);