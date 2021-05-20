import { IIdentifierList } from "../../../shared/utils/identifier";
import { RequiredIdentifiers, RequiredIdentifier } from "./identifer";

interface IUserFindQueryItem { [field: string]: any }
export interface IUserFindQuery { $or: Array<IUserFindQueryItem> }
export interface IUserSchema {
	ids: {
		license?: string,
		license2: string,
		steam?: string,
		discord?: string,
		xbl?: string,
		live?: string,
		ip?: string,
		fivem?: string,
	},
	tokens: string[],
	ban?: {
		reason: string,
		expire?: number,
		permanent?: boolean
	}
}
const userCollection: string = "users";

/**
 * Creates a $or: [ $and: [ ids... ], ... ] query based on the required and optional identifers available
 * @param {IIdentifierList} ids Collection of player identifiers
 * @returns {string} Formatted MongoDB query for finding a user document
 */
export function BuildUserFindQuery(ids: IIdentifierList) {
	let query: IUserFindQuery = { $or: [] };
	let optionalCount = 0;

	// Push all required with a single optional in a $and entry
	for (let idx = 0; idx < RequiredIdentifier.length; idx++) {
		const id = RequiredIdentifier[idx];

		if (ids[id]) {
			let item: IUserFindQueryItem = {};

			// Collect all the required fields in an array
			for (let reqIdx = 0; reqIdx < RequiredIdentifiers.length; reqIdx++) {
				const reqId = RequiredIdentifiers[reqIdx];

				item[`ids.${reqId}`] = ids[reqId];
			}

			item[`ids.${id}`] = ids[id];
			query.$or.push(item);
			optionalCount++;
		}
	}

	if (optionalCount > 1) {
		// Push all required and optional identifers in a $and entry
		let item: IUserFindQueryItem = {};

		// Collect all the required fields in an array
		for (let reqIdx = 0; reqIdx < RequiredIdentifiers.length; reqIdx++) {
			const reqId = RequiredIdentifiers[reqIdx];

			item[`ids.${reqId}`] = ids[reqId];
		}

		// Push all optional in a $and entry
		for (let idx = 0; idx < RequiredIdentifier.length; idx++) {
			const id = RequiredIdentifier[idx];

			if (ids[id]) {
				item[`ids.${id}`] = ids[id];
			}
		}

		query.$or.push(item);
	}

	return query;
}

export const UserCollection: string = userCollection;