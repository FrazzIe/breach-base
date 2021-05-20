import { IIdentifierList } from "../../../shared/utils/identifier";
import { UserCollection } from "../user/query";

export interface IBanSchema {
	reason: string,
	expire?: number,
	permanent?: boolean
}

export function BuildBanFindQuery(ids: IIdentifierList, tokens: string[]): string {
	return "";
}

export const BanCollection: string = UserCollection;