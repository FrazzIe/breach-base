import { IIdentifierList } from "../../../shared/utils/identifier";
import { RequiredIdentifiers, RequiredIdentifier } from "./identifer";

interface IUserFindQueryItemField { [field: string]: any }
interface IUserFindQueryItem { $and: Array<IUserFindQueryItemField> }
interface IUserFindQuery { $or: Array<IUserFindQueryItem> }

/**
 * Creates a $or: [ $and: [ ids... ], ... ] query based on the required and optional identifers available
 * @param ids Collection of player identifiers
 * @returns Formatted MongoDB query for finding a user document
 */
export function BuildUserFindQuery(ids: IIdentifierList) {
	let userFindQuery: IUserFindQuery = { $or: [] };
	let optionalCount = 0;

	// Push all required with a single optional in a $and entry
	for (let idx = 0; idx < RequiredIdentifier.length; idx++) {
		const id = RequiredIdentifier[idx];

		if (!ids[id])
			continue;

		let userFindQueryItem: IUserFindQueryItem = { $and: [] };

		// Collect all the required fields in an array
		for (let reqIdx = 0; reqIdx < RequiredIdentifiers.length; reqIdx++) {
			const reqId = RequiredIdentifiers[reqIdx];
			const userFindQueryItemField: IUserFindQueryItemField = {};

			userFindQueryItemField[`ids.${reqId}`] = ids[reqId];
			userFindQueryItem.$and.push(userFindQueryItemField);
		}


		const userFindQueryItemField: IUserFindQueryItemField = {};

		userFindQueryItemField[`ids.${id}`] = ids[id];
		userFindQueryItem.$and.push(userFindQueryItemField);
		userFindQuery.$or.push(userFindQueryItem);
		optionalCount++;
	}

	if (optionalCount > 1) {
		// Push all required and optional identifers in a $and entry
		let userFindQueryItem: IUserFindQueryItem = { $and: [] };

		// Collect all the required fields in an array
		for (let reqIdx = 0; reqIdx < RequiredIdentifiers.length; reqIdx++) {
			const reqId = RequiredIdentifiers[reqIdx];
			const userFindQueryItemField: IUserFindQueryItemField = {};

			userFindQueryItemField[`ids.${reqId}`] = ids[reqId];
			userFindQueryItem.$and.push(userFindQueryItemField);
		}

		// Push all optional in a $and entry
		for (let idx = 0; idx < RequiredIdentifier.length; idx++) {
			const id = RequiredIdentifier[idx];

			if (!ids[id])
				continue;

			const userFindQueryItemField: IUserFindQueryItemField = {};

			userFindQueryItemField[`ids.${id}`] = ids[id];
			userFindQueryItem.$and.push(userFindQueryItemField);
		}

		userFindQuery.$or.push(userFindQueryItem);
	}

	return userFindQuery;
}