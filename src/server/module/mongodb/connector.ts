import { Db, MongoClient, MongoError } from "mongodb";

interface ICvarList {
	[key: string]: string;
}

class Connector {
	private uri: string;
	private client: MongoClient;
	private database: Db;
	private initialised: boolean;
	private convars: ICvarList;

	/**
	 * Stores the MongoDB URI
	 *
	 * Initialises the MongoDB Client
	 * @constructor
	 */
	constructor() {
		const _defaultConvar: string = "_mongodb_";
		this.convars = {
			username: GetConvar("mongodb_username", _defaultConvar),
			password: GetConvar("mongodb_password", _defaultConvar),
			host: GetConvar("mongodb_host", _defaultConvar),
			port: GetConvar("mongodb_port", _defaultConvar),
			authdb: GetConvar("mongodb_authdb", _defaultConvar),
			db: GetConvar("mongodb_db", _defaultConvar),
		}

		for (let key in this.convars) {
			if (this.convars[key] == _defaultConvar)
				console.warn(`[MongoDB Connector] Convar "mongodb_${key}" is not set`); //Replace with proper logger util?
		}

		this.uri = this.CreateUri();
		this.client = new MongoClient(this.uri, { useUnifiedTopology: true });
		this.initialised = false;
	}

	/**
	 * Constructs the MongoDB URI
	 * @return {string} The constructed MongoDB URI from settings.json
	 */
	private CreateUri(): string {
		return `mongodb://${encodeURIComponent(this.convars.username)}:${encodeURIComponent(this.convars.password)}@${this.convars.host}:${this.convars.port}/${this.convars.authdb}`;
	}

	/**
	 * Creates a connection to MongoDB
	 *
	 * Stores an instance of the database
	 * @return {Promise<boolean>} If the connection to MongoDB was successfully initialised
	 */
	public Connect(): Promise<boolean> {
		let instance: Connector = this;
		return new Promise((resolve, reject) => {
			instance.client.connect((err: MongoError) => {
				if (err) {
					reject(err);
					return;
				}

				instance.database = instance.client.db(this.convars.db);
				instance.initialised = true;

				resolve(instance.initialised);
			});
		});
	}

	/**
	 * Fetches the connection result
	 * @return {boolean} If the connection to MongoDB was successfully initialised
	 */
	public get Initialised() : boolean {
		return this.initialised;
	}

	/**
	 * Fetches the database instance
	 * @return {Db} The database instance
	 */
	public get Database() : Db {
		return this.database;
	}
}

export default new Connector();