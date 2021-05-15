import DbConnector from "./module/mongodb/index";

async function Init() {
	const [DbInstance, DbInsert, DbFind, DbUpdate, DbDelete] = await DbConnector();
}

setImmediate(Init);