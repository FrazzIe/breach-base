import { ObjectId } from "mongodb";
import { IIdentifierList } from "../../../../shared/utils/identifier";
import { RequiredIdentifier, RequiredIdentifiers } from "../identifer";
import { IUserSchema } from "./schema";

interface IUserUpdateQueryItem { [field: string]: any }
export interface IUserUpdateQuery {
	$set?: IUserUpdateQueryItem,
	$addToSet?: IUserUpdateQueryItem
}
export interface IUserUpdateFilter {
	_id: ObjectId,
}

/**
 * Creates an update query based on user identfiers and tokens
 * @param {IUserSchema} data user document retrieved from the a find query
 * @param {IIdentifierList} ids Collection of player identifiers
 * @param {string[]} tokens Collection of player tokens
 * @returns {[IUserUpdateFilter, IUserUpdateQuery, boolean]} Formatted MongoDB filter & query for updating a user document and if anything has changed
 */
 export function BuildUserUpdateQuery(data: IUserSchema, ids: IIdentifierList, tokens: string[]): [IUserUpdateFilter, IUserUpdateQuery, boolean] {
	let newTokens: string[] = [];
	let newIdentifiers: IIdentifierList = {};

	//Collect new tokens
	if (tokens.length > 0) {
		if (data.tokens.length == 0)
			newTokens = tokens;
		else {
			for (let i = 0; i < tokens.length; i++) {
				const token = tokens[i];
				if (!data.tokens.includes(token))
					newTokens.push(token);
			}
		}
	}

	//Collect new or changed identifers
	for (let key in ids) {
		const id = ids[key];
		if (!data.ids[key])
			newIdentifiers[key] = id;
		else if (data.ids[key] != id && !RequiredIdentifier.includes(key) && !RequiredIdentifiers.includes(key))
			newIdentifiers[key] = id;
	}

	const filter: IUserUpdateFilter = { _id: data._id };
	const update: IUserUpdateQuery = {};
	const newIdentifiersCount = Object.keys(newIdentifiers).length;

	//Return if nothing needs updating
	if (newTokens.length == 0 && newIdentifiersCount == 0)
		return [filter, update, false];

	//Insert new or changed identifers into query
	if (newIdentifiersCount > 0) {
		update.$set = {};

		for (let key in newIdentifiers)
			update.$set[`ids.${key}`] = newIdentifiers[key];
	}

	//Insert new tokens into query
	if (newTokens.length > 0) {
		update.$addToSet = {};
		update.$addToSet.tokens = { $each: newTokens };
	}

	return [filter, update, true];
}