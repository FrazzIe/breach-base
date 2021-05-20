import { IIdentifierList } from "../../../shared/utils/identifier";
import { RequiredIdentifiers, RequiredIdentifier } from "../user/identifer";
import { UserCollection } from "../user/query";

interface IBanFindQueryFirstItem { ban: { $exists: true } }
interface IBanFindQuerySecondItemField { [field: string]: any }
interface IBanFindQuerySecondItem { $or: Array<IBanFindQuerySecondItemField> }
export interface IBanFindQuery { $and: [IBanFindQueryFirstItem, IBanFindQuerySecondItem]}
export interface IBanSchema {
	reason: string,
	expire?: number,
	permanent?: boolean
}

export function BuildBanFindQuery(ids: IIdentifierList, tokens: string[]): IBanFindQuery {
	const firstItem: IBanFindQueryFirstItem = { ban: { $exists: true } };
	let secondItem: IBanFindQuerySecondItem = { $or: [] };

	// Collect all the required fields in an array
	for (let reqIdx = 0; reqIdx < RequiredIdentifiers.length; reqIdx++) {
		const reqId = RequiredIdentifiers[reqIdx];
		const field: IBanFindQuerySecondItemField = {};

		field[`ids.${reqId}`] = ids[reqId];
		secondItem.$or.push(field);
	}

	// Collect all the optional fields in an array
	for (let idx = 0; idx < RequiredIdentifier.length; idx++) {
		const id = RequiredIdentifier[idx];

		if (ids[id]) {
			const field: IBanFindQuerySecondItemField = {};

			field[`ids.${id}`] = ids[id];
			secondItem.$or.push(field);
		}
	}

	secondItem.$or.push({ tokens: { $in: tokens } });

	return { $and: [firstItem, secondItem] };
}

export const BanCollection: string = UserCollection;