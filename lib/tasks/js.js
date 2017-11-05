const webpack = require('webpack');
const gutil = require('gulp-util');
const util = require('util');
const bs = require('browser-sync').get('feb');

const webpackDevConfig = require('../config/webpack.dev');
const webpackProdConfig = require('../config/webpack.prod');

let webpackConfig; // 定义 webpackConfig，防止重新获取

// 使用 webpack 打包 JS
function webpackJs(cb) {
  // 使用 wds 的情况
  if (!global.FEB_PROD && global.FEB_CONFIG.js.wds) {
    if (cb) cb();
    return;
  }

  // 获取 webpack 配置
  if (!webpackConfig) {
    webpackConfig = global.FEB_PROD ? webpackProdConfig() : webpackDevConfig();

    if (global.FEB_CONFIG.project.debug) {
      gutil.log('当前使用的 webpack 配置如下：');
      console.log(util.inspect(webpackConfig, { depth: null, colors: true }));
    }
  }

  // 使用 webpack 构建
  webpack(webpackConfig).run((err, stats) => {
    if (err) throw new gutil.PluginError('webpack', err);
    if (global.FEB_CONFIG.project.debug) {
      gutil.log('[webpack]', stats.toString({
        colors: true
      }));
    }
    if (!global.FEB_PROD && global.FEB_CONFIG.project.reload) bs.reload();
    if (cb) cb();
  });
}

module.exports = webpackJs;
