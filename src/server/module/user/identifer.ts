import { IIdentifierList } from "../../../shared/utils/identifier";

//Identifiers that are required
export const requiredIds: string[] = ["license2"];
const requiredIdsMessage: string[] = [
	"Unable to retrieve your R* Id, is your R* account linked?",
];
//At least one of the identifers are required
export const oneOfId: string[] = ["discord", "steam"];
const oneOfIdMessage: string = "You must link your discord or steam account to join this server!";

/**
 * Check if a player has the required identifers needed to play
 * @param {IIdentifierList} ids Collection of player identifiers
 * @returns {[boolean, string]} Returns if the collection contains the required identifiers and an optional error message
 */
export function HasRequiredIdentifiers(ids: IIdentifierList): [result: boolean, message?: string] {
	for (let idx = 0; idx < requiredIds.length; idx++) {
		const id = requiredIds[idx];
		if (!ids[id])
			return [false, requiredIdsMessage[idx]];
	}

	for (let idx = 0; idx < oneOfId.length; idx++) {
		const id = oneOfId[idx];
		if (ids[id])
			return [true];
	}

	return [false, oneOfIdMessage];
}