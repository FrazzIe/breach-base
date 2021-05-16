import { hexToDec } from "hex2dec";

export interface IIdentifierList {
	[id: string]: string;
}

/**
 * Retrieves a list of player identifiers (steam, license, license2, xbl, live, ip, discord, fivem)
 * @param src The player server id
 * @returns A list of player identifiers
 */
export function GetIdentifiers(src: string) {
	const ids: IIdentifierList = {}

	for (let i = 0; i < GetNumPlayerIdentifiers(src); i++) {
		const data: string[] = GetPlayerIdentifier(src, i).split(':');

		if (data.length > 0) {
			if (data[0] == "steam")
				data[1] = hexToDec(data[1]);

			ids[data[0]] = data[1];
		}
	}

	return ids;
}