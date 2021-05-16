import { hexToDec } from "hex2dec";

export interface IIdentifierList {
	[id: string]: string;
}

export function GetIdentifiers(src: string) {
	const ids: IIdentifierList = {}

	for (let i = 0; i < GetNumPlayerIdentifiers(src); i++) {
		const data = GetPlayerIdentifier(src, i).split(':');

		if (data.length > 0) {
			if (data[0] == "steam")
				data[1] = hexToDec(data[1]);

			ids[data[0]] = data[1];
		}
	}

	return ids;
}