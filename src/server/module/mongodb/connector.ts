import { Db, MongoClient, MongoError } from "mongodb";
import settings from "./settings.json";

class Connector {
	private uri: string;
	private client: MongoClient;
	private database: Db;
	private initialised: boolean;

	/**
	 * Stores the MongoDB URI
	 *
	 * Initialises the MongoDB Client
	 * @constructor
	 */
	constructor() {
		this.uri = this.GetUri();
		this.client = new MongoClient(this.uri);
		this.initialised = false;
	}

	/**
	 * Constructs the MongoDB URI
	 * @return {string} The constructed MongoDB URI from settings.json
	 */
	private GetUri(): string {
		return `mongodb://${settings.username}:${settings.password}@${settings.host}:${settings.port}/${settings.database}`;
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
			this.client.connect(function(err: MongoError) {
				if (err) {
					reject(err);
					return;
				}

				instance.database = instance.client.db();
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