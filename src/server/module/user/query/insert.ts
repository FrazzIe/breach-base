import { IIdentifierList } from "../../../../shared/utils/identifier";
import { IUserSchema } from "./schema";

export function BuildUserInsertQuery(ids: IIdentifierList, tokens: string[]): IUserSchema {
	const document: IUserSchema = {
		ids: {},
		tokens: tokens
	};

	for (let key in ids)
		document.ids[key] = ids[key];

	return document;
}