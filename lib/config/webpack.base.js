const path = require('path');
const glob = require('glob');
const webpack = require('webpack');
const webpackMerge = require('webpack-merge');
const StatsPlugin = require('stats-webpack-plugin');

const webpackBabel = require('./webpackCustom/webpack.babel');
const webpackAssets = require('./webpackCustom/webpack.assets');
const webpackESLint = require('./webpackCustom/webpack.eslint');
const webpackUser = require('./webpackCustom/webpack.user');

const cdnUtil = require('../../util/cdn');

module.exports = function () {
  const FEB_PROD = global.FEB_PROD;
  const FEB_PATH = global.FEB_PATH;
  const FEB_CONFIG = global.FEB_CONFIG;


  // js 目录下，一个 js 文件一个入口
  const entries = {};
  glob.sync(path.join(FEB_PATH.project, './src/js/*.js')).forEach((filePath) => {
    const prop = path.basename(filePath, '.js');
    entries[prop] = filePath;
  });


  // webpack 基础配置
  let webpackBaseConfig = {
    // 放这里让用户可以自定义 devtool
    devtool: FEB_PROD ? false : '#cheap-eval-source-map',
    context: FEB_PATH.project,
    cache: true,
    profile: FEB_CONFIG.project.debug,
    entry: entries,
    output: {
      path: FEB_PROD ? FEB_PATH.output.dir : FEB_PATH.dev.dir,
      publicPath: (FEB_PROD && FEB_CONFIG.project.cdn)
        ? `${cdnUtil.getProtocol(FEB_CONFIG.project.cdn.protocol)}//${cdnUtil.getPath(FEB_CONFIG.project.cdn.path)}`
        : './',
      filename: 'assets/js/[name].js'
    },
    resolveLoader: {
      fallback: [FEB_PATH.module]
    },
    resolve: {
      extensions: ['', '.js', '.vue', '.json'],
      root: [path.join(FEB_PATH.project, './src/js')],
      fallback: [FEB_PATH.module]
    },
    module: {
      noParse: ['vendor'],
      loaders: [
        { test: /\.html$/, loader: 'raw-loader' },
        { test: /\.json$/, loader: 'json-loader' },
        {
          test: /\.tpl$/,
          loader: 'art-template-loader',
          query: {
            debug: !FEB_PROD,
            htmlResourceRules: false,
            extname: '.tpl'
          }
        }
      ]
    },
    plugins: [
      new webpack.DefinePlugin({
        __PROD__: FEB_PROD,
        __DEV__: !FEB_PROD
      })
    ]
  };

  // debug 模式下输出 webpack stat.json
  if (FEB_CONFIG.project.debug) {
    webpackBaseConfig.plugins.push(
      new StatsPlugin('stats.json', {
        chunkModules: true,
        exclude: [/node_modules/]
      })
    );
  }

  // Babel 功能
  if (FEB_CONFIG.js.babel) {
    webpackBaseConfig = webpackMerge(webpackBaseConfig, webpackBabel());
  }

  // ESLint 功能
  if (FEB_CONFIG.js.eslint) {
    webpackBaseConfig = webpackMerge(webpackBaseConfig, webpackESLint());
  }

  // 使用 webpack 处理 assets
  if (FEB_CONFIG.js.assets) {
    webpackBaseConfig = webpackMerge(webpackBaseConfig, webpackAssets());
  }

  // 用户的 webpack 配置
  webpackBaseConfig = webpackMerge(webpackBaseConfig, webpackUser());

  return webpackBaseConfig;
};
