import { HasRequiredIdentifiers } from "../user/identifer";
import { Collection, Db, FindOneOptions, InsertOneWriteOpResult, ObjectId } from "mongodb";
import { GetIdentifiers, IIdentifierList } from "../../../shared/utils/identifier";
import { GetTokens } from "../../../shared/utils/token";
import { BuildUserFindQuery, BuildUserInsertQuery, BuildUserUpdateQuery, IUserFindQuery, IUserSchema, UserCollection } from "../user/query";
import { BanCollection, BuildBanFindQuery, IBanFindQuery, IBanSchema } from "../ban/query";

const settings = {
	checkBan: 0,
};
const messages = {
	checkIdentifiers: "Checking identifiers",
	checkBan: "Checking for ban",
	fetch: "Fetching account data",
	banMessage: "\r\nYou have been banned from this server",
	banMessagePermanent: "\r\nYou have been permanently banned from the server",
	banExpire: "\r\nExpires:",
	banReason: "\r\nReason:",
	banId: "\r\nID:",
	update: "Updating account data",
	create: "Creating account"
};

interface ICfxDeferral {
	defer(): void,
	update(message: string): void,
	presentCard(card: object | string, cb?: (data: any, rawData: string) => void): void,
	done(failureReason?: string): void,
	handover(data: { [key: string]: any }): void,
}

async function OnPlayerConnected(name: string, deferrals: ICfxDeferral, db: Db): Promise<void> {
	const src: string = (global as any).source
	const ids: IIdentifierList = GetIdentifiers(src);
	const tokens: string[] = GetTokens(src);

	deferrals.defer();
	deferrals.update(messages.checkIdentifiers);

	//Check if a player has the required identifers needed to play
	const [found, message] = HasRequiredIdentifiers(ids);
	if (!found) {
		deferrals.done(message);
		return;
	}

	//Check if ban checking is enabled
	if (settings.checkBan) {
		deferrals.update(messages.checkBan);

		//Build ban query, look for ban
		const banCollection: Collection = db.collection(BanCollection);
		const [banFindQuery, banFindOptions]: [IBanFindQuery, FindOneOptions<any>] = BuildBanFindQuery(ids, tokens);
		const banFindResult: IBanSchema = await banCollection.findOne(banFindQuery, banFindOptions);

		//Check if a ban exists
		if (banFindResult) {
			//Reject if permanent
			if (banFindResult.ban.permanent) {
				deferrals.done(`${messages.banMessagePermanent} ${messages.banReason} ${banFindResult.ban.reason} ${messages.banId} ${banFindResult._id.toHexString()}`);
				return;
			}

			const currentTime: number = Date.now();
			const expireTime: number = banFindResult.ban.expire * 1000;

			//Reject if not expired
			if (currentTime < expireTime) {
				const expireDate = new Date(expireTime);
				deferrals.done(`${messages.banMessage} ${messages.banExpire} ${expireDate.toUTCString()} ${messages.banReason} ${banFindResult.ban.reason} ${messages.banId} ${banFindResult._id.toHexString()}`);
				return;
			}

			//Remove expired ban
			banCollection.updateOne({ _id: banFindResult._id }, { $unset: { ban: 1 } });
		}
	}

	deferrals.update(messages.fetch);

	//Build user query, look for user
	const userCollection: Collection = db.collection(UserCollection);
	const userFindQuery: IUserFindQuery = BuildUserFindQuery(ids);
	const userFindResult: IUserSchema = await userCollection.findOne(userFindQuery);
	let userId: ObjectId;

	if (userFindResult) {
		//Build update query, update if necessary
		deferrals.update(messages.update);
		const [userUpdateFilter, userUpdateQuery, userUpdateRequired] = BuildUserUpdateQuery(userFindResult, ids, tokens);
		if (userUpdateRequired)
			userCollection.updateOne(userUpdateFilter, userUpdateQuery);

		userId = userFindResult._id;
	} else {
		//Build create query, create user
		deferrals.update(messages.create);
		const userInsertQuery: IUserSchema = BuildUserInsertQuery(ids, tokens);
		const userInsertResult: InsertOneWriteOpResult<any> = await userCollection.insertOne(userInsertQuery);

		userId = userInsertResult.insertedId;
	}


	deferrals.done("Leave");
}

export default function Init(db: Db): void {
	settings.checkBan = GetConvarInt("queue_check_bans", 1);

	on("playerConnecting", (name: string, _setKickReason: (reason: string) => void, deferrals: ICfxDeferral) => OnPlayerConnected(name, deferrals, db));
}