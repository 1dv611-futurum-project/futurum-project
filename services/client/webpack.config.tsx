const path = require("path");

const DIST_DIR   = path.join(__dirname, "src/client/public/dist"),
      CLIENT_DIR = path.join(__dirname, "src/client/src");

module.exports = {
	context: CLIENT_DIR,

	entry: "./index",

	output: {
		path:     DIST_DIR,
		filename: "bundle.js"
	},
    
    devtool: "source-map",

    resolve: {
        extensions: [".ts", ".tsx", ".js", ".json"]
    },

    module: {
        rules: [
            { test: /\.tsx?$/, loader: "awesome-typescript-loader" },
            { test: /\.css$/, use: [ "style-loader", "css-loader" ] },
            { enforce: "pre", test: /\.js$/, loader: "source-map-loader" }
        ]
    }
};