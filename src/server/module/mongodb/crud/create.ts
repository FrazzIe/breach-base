import { Db } from "mongodb";

class DbCreate {
	private initialised: boolean;
	private database: Db;

	constructor() {
		this.initialised = false;
		this.database = null;
	}

	public Init(_database: Db, _initialised: boolean): void {
		this.database = _database;
		this.initialised = _initialised;
	}


}

export default new DbCreate();