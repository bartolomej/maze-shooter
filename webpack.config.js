const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: {
    'bundle.min.css': [
      path.resolve(__dirname, 'src/styles/index.css'),
      path.resolve(__dirname, 'src/styles/game.css'),
      path.resolve(__dirname, 'src/styles/about.css'),
      path.resolve(__dirname, 'src/styles/landing.css'),
      path.resolve(__dirname, 'src/styles/setup.css'),
    ],
    'bundle.js': [
      path.resolve(__dirname, './src/index.js')
    ]
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          use: 'css-loader'
        })
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new ExtractTextPlugin("bundle.min.css"),
    new CopyPlugin([
      {
        from: path.resolve(__dirname, 'src', 'index.html'),
        to: path.resolve(__dirname, 'dist')
      },
      {
        from: path.resolve(__dirname, 'assets'),
        to: path.resolve(__dirname, 'dist')
      },
    ]),
  ],
  devServer: {
    contentBase: path.resolve(__dirname, 'dist')
  },
  devtool: 'inline-source-map',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name]'
  }
};