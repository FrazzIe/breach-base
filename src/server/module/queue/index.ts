import { HasRequiredIdentifiers } from "../user/identifer";
import { Db } from "mongodb";
import { GetIdentifiers, IIdentifierList } from "../../../shared/utils/identifier";

const messages = {
	fetch: "Fetching account data",
}

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

	deferrals.defer();
	deferrals.update(messages.fetch);

	const [found, message] = HasRequiredIdentifiers(ids);
	if (!found) {
		deferrals.done(message);
		return;
	}


	// db.collection("users").findOne({});
	// db.collection("users").insertOne({});
	deferrals.done("Leave");
}

export default function Init(db: Db): void {
	on("playerConnecting", (name: string, _setKickReason: (reason: string) => void, deferrals: ICfxDeferral) => OnPlayerConnected(name, deferrals, db));
}