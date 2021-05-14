// webpack.prod.js
const webpackCommon = require("./webpack.common");

const clientDefOptions = {
	CLIENT: true,
	SERVER: false,
	DEBUG: true,
	PRODUCTION: true,
}

const serverDefOptions = {
	CLIENT: false,
	SERVER: true,
	DEBUG: true,
	PRODUCTION: false,
}

const main = {
	mode: "production",
	optimization: {
		minimize: true,
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