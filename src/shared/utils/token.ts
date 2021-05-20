/**
 * Retrieves a list of player hardware tokens
 * @param {string} src The player server id
 * @returns {string[]} A list of player tokens
 */
export function GetTokens(src: string): string[] {
	const tokens: string[] = [];
	const tokenCount: number = GetNumPlayerTokens(src);
	for (let i = 0; i < tokenCount; i++)
		tokens.push(GetPlayerToken(src, i));

	return tokens;
}