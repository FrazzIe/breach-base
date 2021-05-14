// webpack.dev.js
const webpackCommon = require("./webpack.common");

const clientDefOptions = {
	CLIENT: true,
	SERVER: false,
	DEBUG: true,
	PRODUCTION: false,
	"ifdef-verbose": true,
}

const serverDefOptions = {
	CLIENT: false,
	SERVER: true,
	DEBUG: true,
	PRODUCTION: false,
	"ifdef-verbose": true,
}

const main = {
	devtool: "inline-source-map",
	mode: "development",
	watch: true,
	optimization: {
		minimize: false,
	}
};

const client = {
	...webpackCommon[0],
	...main,
	module: {
		rules: [
			{
				test: /\.tsx?$/,
				use: [
					{ loader: "ts-loader" },
					{ loader: "ifdef-loader", options: clientDefOptions }
				],
				exclude: /node_modules/,
			},
		],
	},
};

const server = {
	...webpackCommon[1],
	...main,
	module: {
		rules: [
			{
				test: /\.tsx?$/,
				use: [
					{ loader: "ts-loader" },
					{ loader: "ifdef-loader", options: serverDefOptions }
				],
				exclude: /node_modules/,
			},
		],
	},
};

module.exports = [client, server];