import { ObjectId } from "mongodb";

export interface IUserSchema {
	_id?: ObjectId,
	ids: {
		[id: string]: string,
		license?: string,
		license2?: string,
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