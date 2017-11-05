const webpack = require('webpack');
const webpackMerge = require('webpack-merge');
const webpackBaseConfig = require('./webpack.base');
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin');
const queryString = require('query-string');
const gutil = require('gulp-util');
const util = require('util');
const is = require('../../util/is');

module.exports = function () {
  // 获取基础配置
  const baseConfig = webpackBaseConfig();
  // 插件数组
  let plugins = [];
  // HMR 配置
  let hmrConfig = global.FEB_CONFIG.js.hmr;

  // 不是 debug 模式就不输出了
  if (!global.FEB_CONFIG.project.debug) {
    plugins.push(
      new FriendlyErrorsPlugin()
    );
  }

  // 如果启用 wds && hmr
  if (hmrConfig) {
    // 如果 hmr 设为 true，启用默认配置，否则会跳过，直接使用用户的 HMR 配置
    hmrConfig = is.Object(hmrConfig) ? hmrConfig : {
      timeout: 20000,
      overlay: false,
      noInfo: true,
      reload: global.FEB_CONFIG.project.reload
    };

    // debug 模式下输出 HMR 配置
    if (global.FEB_CONFIG.project.debug) {
      gutil.log('当前使用的 HMR 配置如下：');
      console.log(util.inspect(hmrConfig, { depth: null, colors: true }));
    }

    // HMR 的脚本
    const hotMiddlewareScript =
      `webpack-hot-middleware/client?${queryString.stringify(hmrConfig)}`;
    // 为每个 webpack 配置中的每个 entry 添加 HMR 脚本
    Object.keys(baseConfig.entry).forEach((name) => {
      baseConfig.entry[name] = [hotMiddlewareScript].concat(baseConfig.entry[name]);
    });

    plugins = plugins.concat([
      new webpack.optimize.OccurrenceOrderPlugin(), // wepback 1 需要这个插件启用 HMR
      new webpack.HotModuleReplacementPlugin(), // HMR 插件
      new webpack.NoErrorsPlugin()
    ]);
  }


  return webpackMerge(baseConfig, {
    debug: global.FEB_CONFIG.project.debug,
    plugins
  });
};
