const common = require('./webpack.common.js');
const merge = require('webpack-merge');
const path = require('path');


module.exports = merge(common, {
  mode: "development",
  devtool: 'source-map',
  devServer: {
    contentBase: path.resolve(__dirname, 'dist')
  },
});