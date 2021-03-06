// tslint:disable-next-line:no-reference
///<reference path='./node_modules/@types/node/index.d.ts'/>

import path = require('path');
import process = require('process');

const env = process.env.NODE_ENV || 'development';
const CLIENT_DIR = path.join(__dirname, 'src');
const DIST_DIR   = path.join(__dirname, 'src/public/dist');

module.exports = {
	context: CLIENT_DIR,
	mode: env,
	entry: './index.tsx',
	output: {
		path: DIST_DIR,
		filename: 'bundle.js'
	},
	resolve: {
		extensions: ['.ts', '.tsx', '.js', '.json', '.scss']
	},
	module: {
		rules: [
			{
				test: /\.tsx?$/,
				loader: 'awesome-typescript-loader'
			},
			{
				test: /(\.css|.scss)$/,
				exclude: /node_modules/,
				include: path.join(__dirname, 'src/assets'),
				use: [ 'style-loader', 'css-loader', 'sass-loader' ]
			},
			{
				test: /\.js$/,
				exclude: /node_modules/,
				use: [
					{
						loader: 'babel-loader',
						options: {
							presets: [ 'react', 'es2015' ]
						}
					},
					{
						loader: 'react-hot-loader/webpack'
					}
				]
			}
		]
	},
	devServer: {
		contentBase: CLIENT_DIR,
		publicPath: '/',
		port: 3000,
		public: 'localhost:3000',
		overlay: true,
		host: '0.0.0.0',
		watchOptions: {
			poll: false
		},
		historyApiFallback: true
	}
};
