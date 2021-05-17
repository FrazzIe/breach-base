import { Db } from "mongodb";
import DbConnector from "./module/mongodb/index";

async function Init() {
	const db: Db = await DbConnector();
}

setImmediate(Init);