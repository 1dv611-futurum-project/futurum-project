// tslint:disable-next-line:no-var-requires
const path = require('path');

const DIST_DIR   = path.join(__dirname, 'src/client/public/dist');
const CLIENT_DIR = path.join(__dirname, 'src/client/src');

module.exports = {
  context: CLIENT_DIR,
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
        include: path.join(__dirname, 'src/client/src/assets'),
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
