const bs = require('browser-sync').create('feb'); // browser sync
const _ = require('lodash');
const webpack = require('webpack');
const gutil = require('gulp-util');
const util = require('util');
const devMiddleware = require('webpack-dev-middleware');
const hotMiddleware = require('webpack-hot-middleware');

const webpackDevConfig = require('../config/webpack.dev');

// wds 开启时，webpack 编译完成触发 reload
function bsReloadMiddleware(compiler) {
  compiler.plugin('done', () => {
    bs.reload();
  });
  const middleware = function (req, res, next) {
    return next();
  };
  return middleware;
}

// 启动 browserSync（功能同 livereload）
function browserSync(cb) {
  // 不使用 browser-sync，用于静默发布
  if (global.FEB_NO_BS) {
    if (cb) cb();
    return;
  }

  // 路径
  const paths = global.FEB_PATH;
  // 配置
  const config = global.FEB_CONFIG.project.bs;
  // 中间件
  const middleware = [];

  // 开发模式，而且使用 wds
  if (!global.FEB_PROD && global.FEB_CONFIG.js.wds) {
    const webpackConfig = webpackDevConfig();
    const compiler = webpack(webpackConfig);
    const devMiddlewareInstance = devMiddleware(compiler, {
      quiet: !global.FEB_CONFIG.project.debug,
      stats: {
        colors: true
      },
      watchOptions: {
        aggregateTimeout: 300,
        poll: 1000
      },
      publicPath: webpackConfig.output.publicPath.replace('./', '/')
    });
    middleware.push(devMiddlewareInstance);

    // 如果启用 HMR
    if (global.FEB_CONFIG.js.hmr) {
      const hotMiddlewareInstance = hotMiddleware(compiler, {
        log: () => {}
      });
      middleware.push(hotMiddlewareInstance);
    } else {
      middleware.push(bsReloadMiddleware(compiler));
    }

    // debug 模式下输出配置
    if (global.FEB_CONFIG.project.debug) {
      gutil.log('当前使用的 webpack 配置如下：');
      console.log(util.inspect(webpackConfig, { depth: null, colors: true }));
    }
  }

  bs.init(_.defaultsDeep(config, {
    ghostMode: false,
    server: global.FEB_PROD ? paths.output.dir : paths.dev.dir,
    middleware: middleware.length > 0 ? middleware : false
  }));
}

module.exports = browserSync;
