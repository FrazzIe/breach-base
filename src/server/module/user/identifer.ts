import { IIdentifierList } from "../../../shared/utils/identifier";

const requiredIds: string[] = ["license2", "ip"];
const requiredIdsMessage: string[] = [
	"Unable to retrieve your R* Id, is your R* account linked?",
	"Unable to retrieve your endpoint, try again?",
];
const requiredThirdId: string[] = ["discord", "steam"];
const requiredThirdIdMessage: string = "You must link your discord or steam account to join this server!";

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

	for (let idx = 0; idx < requiredThirdId.length; idx++) {
		const id = requiredThirdId[idx];
		if (ids[id])
			return [true];
	}

	return [false, requiredThirdIdMessage];
}