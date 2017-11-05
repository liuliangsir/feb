const webpack = require('webpack');
const webpackMerge = require('webpack-merge');
const webpackBaseConfig = require('./webpack.base');

module.exports = function () {
  return webpackMerge(webpackBaseConfig(), {
    devtool: false,
    bail: true, // 出现错误会终止构建
    plugins: [
      new webpack.optimize.OccurrenceOrderPlugin(),
      new webpack.optimize.DedupePlugin(),
      new webpack.optimize.UglifyJsPlugin({
        compress: {
          screw_ie8: global.FEB_CONFIG.js.assets,
          warnings: global.FEB_CONFIG.project.debug,
          drop_console: !global.FEB_CONFIG.js.console
        },
        mangle: {
          screw_ie8: global.FEB_CONFIG.js.assets
        },
        output: {
          screw_ie8: global.FEB_CONFIG.js.assets
        }
      })
    ]
  });
};
