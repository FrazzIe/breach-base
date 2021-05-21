import { HasRequiredIdentifiers } from "../user/identifer";
import { Collection, Db, FindOneOptions } from "mongodb";
import { GetIdentifiers, IIdentifierList } from "../../../shared/utils/identifier";
import { GetTokens } from "../../../shared/utils/token";
import { BuildUserFindQuery, IUserFindQuery, IUserSchema, UserCollection } from "../user/query";
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

	const [found, message] = HasRequiredIdentifiers(ids);
	if (!found) {
		deferrals.done(message);
		return;
	}

	if (settings.checkBan) {
		deferrals.update(messages.checkBan);

		const banCollection: Collection = db.collection(BanCollection);
		const banFindQuery: IBanFindQuery = BuildBanFindQuery(ids, tokens);
		const banFindOptions: FindOneOptions<any> = { projection: { "_id": 1, "ban.permanent": 1, "ban.expire": 1, "ban.reason": 1 } };
		const banFindResult: IBanSchema = await banCollection.findOne(banFindQuery, banFindOptions);

		if (banFindResult) {
			if (banFindResult.ban.permanent) {
				deferrals.done(`${messages.banMessagePermanent} ${messages.banReason} ${banFindResult.ban.reason} ${messages.banId} ${banFindResult._id.toHexString()}`);
				return;
			}

			const currentTime: number = Date.now();
			const expireTime: number = banFindResult.ban.expire * 1000;

			if (currentTime < expireTime) {
				const expireDate = new Date(expireTime);
				deferrals.done(`${messages.banMessage} ${messages.banExpire} ${expireDate.toUTCString()} ${messages.banReason} ${banFindResult.ban.reason} ${messages.banId} ${banFindResult._id.toHexString()}`);
				return;
			}
		}
	}

	deferrals.update(messages.fetch);
	const userCollection: Collection = db.collection(UserCollection);
	const userFindQuery: IUserFindQuery = BuildUserFindQuery(ids);
	const userFindResult: IUserSchema = await userCollection.findOne(userFindQuery);

	console.log(userFindResult);
	// db.collection("users").findOne({});
	// db.collection("users").insertOne({});
	deferrals.done("Leave");
}

export default function Init(db: Db): void {
	settings.checkBan = GetConvarInt("queue_check_bans", 1);

	on("playerConnecting", (name: string, _setKickReason: (reason: string) => void, deferrals: ICfxDeferral) => OnPlayerConnected(name, deferrals, db));
}