export function Cake(): string {
	/// #if SERVER
	return "Carrot Cake";
	/// #elif CLIENT
	return "Chocolate Cake"
	/// #endif
}