// webpack.common.js
const path = require("path");
const RemovePlugin = require("remove-files-webpack-plugin");
const buildPath = path.resolve(__dirname, "dist");
const clientBuildPath = path.resolve(buildPath, "client");
const serverBuildPath = path.resolve(buildPath, "server");

const main = {
	resolve: {
		extensions: [".tsx", ".ts", ".js"],
	},
};

const client = {
	...main,
	entry: path.resolve(__dirname, "./src/client/index.ts"),
	output: {
		filename: "[fullhash].client.js",
		path: clientBuildPath,
	},
	plugins: [
		new RemovePlugin({
			before: {
				include: [
					clientBuildPath
				]
			},
			watch: {
				include: [
					clientBuildPath
				]
			}
		}),
	],
};

const server = {
	...main,
	entry: path.resolve(__dirname, "./src/server/index.ts"),
	output: {
		filename: "[fullhash].server.js",
		path: serverBuildPath,
	},
	plugins: [
		new RemovePlugin({
			before: {
				include: [
					serverBuildPath
				]
			},
			watch: {
				include: [
					serverBuildPath
				]
			}
		}),
	],
	target: "node",
};

module.exports = [client, server];