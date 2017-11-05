const path = require('path');
const glob = require('glob');
const webpack = require('webpack');
const webpackMerge = require('webpack-merge');

module.exports = function () {
  const FEB_PATH = global.FEB_PATH;
  const FEB_CONFIG = global.FEB_CONFIG;

  // 用户的 webpack 配置
  let webpackUserConfig = FEB_CONFIG.webpack;

  // 代码分割功能 split
  if (webpackUserConfig.split.length > 0) {
    webpackUserConfig.entry = {};
    webpackUserConfig.split.forEach((folder) => {
      webpackUserConfig.entry[folder] = glob.sync(path.join(FEB_PATH.project,
        './src/js/', folder, '/**/*.js'));
    });
    webpackUserConfig = webpackMerge(webpackUserConfig, {
      plugins: [
        new webpack.optimize.CommonsChunkPlugin({
          names: webpackUserConfig.split,
          minChunks: Infinity
        })
      ]
    });
  }

  // ProvidePlugin provide
  if (Object.keys(webpackUserConfig.provide).length > 0) {
    webpackUserConfig = webpackMerge(webpackUserConfig, {
      plugins: [
        new webpack.ProvidePlugin(webpackUserConfig.provide)
      ]
    });
  }

  // 删除自定义属性
  ['provide', 'split'].forEach((prop) => {
    delete webpackUserConfig[prop];
  });

  return webpackUserConfig;
};
