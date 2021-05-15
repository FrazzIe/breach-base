import { Db } from "mongodb";

class DbCreate {
	private initialised: boolean;
	private database: Db;

	/**
	 * Initialise class members
	 * @constructor
	 */
	constructor() {
		this.initialised = false;
		this.database = null;
	}

	/**
	 * Sets the database and connection status
	 * @param _database Database instance
	 * @param _initialised Connection result
	 */
	public Init(_database: Db, _initialised: boolean): void {
		this.database = _database;
		this.initialised = _initialised;
	}


}

export default new DbCreate();