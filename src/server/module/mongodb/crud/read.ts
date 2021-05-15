import DbMain from "./main";

class DbRead extends DbMain {
	/**
	 * Initialise class members
	 * @constructor
	 */
	constructor() {
		super();
	}

	public async Find(): Promise<void> {
		return;
	}
}

export default new DbRead();