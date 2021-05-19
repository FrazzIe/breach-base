import { IIdentifierList } from "../../../shared/utils/identifier";

//Identifiers that are required
const requiredIdentifiers: string[] = ["license2"];
const requiredIdentifierMessages: string[] = [
	"Unable to retrieve your R* Id, is your R* account linked?",
];
//At least one of the identifers are required
const requiredIdentifier: string[] = ["discord", "steam"];
const requiredIdentifierMessage: string = "You must link your discord or steam account to join this server!";

/**
 * Check if a player has the required identifers needed to play
 * @param {IIdentifierList} ids Collection of player identifiers
 * @returns {[boolean, string]} Returns if the collection contains the required identifiers and an optional error message
 */
export function HasRequiredIdentifiers(ids: IIdentifierList): [result: boolean, message?: string] {
	for (let idx = 0; idx < requiredIdentifiers.length; idx++) {
		const id = requiredIdentifiers[idx];
		if (!ids[id])
			return [false, requiredIdentifierMessages[idx]];
	}

	for (let idx = 0; idx < requiredIdentifier.length; idx++) {
		const id = requiredIdentifier[idx];
		if (ids[id])
			return [true];
	}

	return [false, requiredIdentifierMessage];
}

export const RequiredIdentifiers: string[] = requiredIdentifiers;
export const RequiredIdentifier: string[] = requiredIdentifier;