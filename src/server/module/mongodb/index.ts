import Connector from "./connector";

export default function Init(): void {
	Connector.Connect().then((result: boolean) => {
		console.log("Connected: " + result);
	}).catch((error) => {
		console.error(error.message, error);
	});
}