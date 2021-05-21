import { FindOneOptions, ObjectId } from "mongodb";
import { IIdentifierList } from "../../../shared/utils/identifier";
import { RequiredIdentifiers, RequiredIdentifier } from "../user/identifer";
import { UserCollection } from "../user/query";

interface IBanFindQueryItem { [field: string]: any }
export interface IBanFindQuery { $or: Array<IBanFindQueryItem> }
export interface IBanSchema {
	_id: ObjectId,
	ban?: {
		reason: string,
		expire?: number,
		permanent?: boolean
	}
}

/**
 * Creates a $or: [ id, id ] query based on the required and optional identifers and tokens
 * @param {IIdentifierList} ids Collection of player identifiers
 * @param {string[]} tokens Collection of player tokens
 * @returns {IBanFindQuery} Formatted MongoDB query for finding a banned user document
 */
export function BuildBanFindQuery(ids: IIdentifierList, tokens: string[]): [IBanFindQuery, FindOneOptions<any>] {
	//const firstItem: IBanFindQueryFirstItem = { ban: { $exists: true } };
	let query: IBanFindQuery = { $or: [] };
	const options: FindOneOptions<any> = { projection: { "_id": 1, "ban.permanent": 1, "ban.expire": 1, "ban.reason": 1 } };

	// Collect all the required fields and push them into the $or array
	for (let reqIdx = 0; reqIdx < RequiredIdentifiers.length; reqIdx++) {
		const reqId = RequiredIdentifiers[reqIdx];
		const item: IBanFindQueryItem = {};

		item[`ids.${reqId}`] = ids[reqId];
		query.$or.push(item);
	}

	// Collect all the optional fields and push them into the $or array
	for (let idx = 0; idx < RequiredIdentifier.length; idx++) {
		const id = RequiredIdentifier[idx];

		if (ids[id]) {
			const item: IBanFindQueryItem = {};

			item[`ids.${id}`] = ids[id];
			query.$or.push(item);
		}
	}

	// Push all the player token into the $or array
	query.$or.push({ tokens: { $in: tokens } });

	// Make sure the ban document exists within every $or array element
	for (let item = 0; item < query.$or.length; item++) {
		query.$or[item].ban = { $exists: true };
	}

	return [query, options];
}

export const BanCollection: string = UserCollection;