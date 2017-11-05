const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const babelConfig = require('../babelrc');
const getPostCss = require('../postcss');
const cdnUtil = require('../../../util/cdn');

module.exports = function () {
  const FEB_CONFIG = global.FEB_CONFIG;
  const FEB_PATH = global.FEB_PATH;
  const FEB_PROD = global.FEB_PROD;

  const cssPublicPath = (FEB_PROD && FEB_CONFIG.project.cdn && !FEB_CONFIG.project.cdn.ignoreCss)
    ? `${cdnUtil.getProtocol(FEB_CONFIG.project.cdn.protocol)}//${cdnUtil.getPath(FEB_CONFIG.project.cdn.path)}`
    : '../../';

  const vueScssConfig = !FEB_PROD
    ? 'vue-style-loader!css-loader?sourceMap!sass-loader?sourceMap'
    : ExtractTextPlugin.extract('vue-style-loader', 'css-loader!sass-loader', {
      publicPath: cssPublicPath
    });

  const vueCssConfig = !FEB_PROD
    ? 'vue-style-loader!css-loader?sourceMap'
    : ExtractTextPlugin.extract('vue-style-loader', 'css-loader', {
      publicPath: cssPublicPath
    });

  return {
    resolve: {
      root: [
        path.join(FEB_PATH.project, './src/img'),
        path.join(FEB_PATH.project, './src/misc'),
        path.join(FEB_PATH.project, './src/css')
      ],
      alias: {
        css: path.join(FEB_PATH.project, './src/css'),
        img: path.join(FEB_PATH.project, './src/img'),
        misc: path.join(FEB_PATH.project, './src/misc')
      }
    },
    module: {
      loaders: [
        {
          test: /\.vue$/,
          loader: 'vue-loader'
        },
        {
          test: /(inline|base64|slice).*\.(png|jpe?g|gif|svg)(\?.*)?$/,
          loaders: !FEB_PROD ? [
            'url-loader'
          ] : [
            'url-loader',
            'image-webpack-loader'
          ]
        },
        {
          test: /\.(png|jpe?g|gif|swf|ttf|eot|svg|woff|woff2|mp3|mp4)(\?.*)?$/,
          exclude: /(inline|base64|slice)/,
          loaders: !FEB_PROD ? [
            `file-loader?name=assets/[path][name]-[hash:10].[ext]&context=${path.join(FEB_PATH.project, 'src/')}`
          ] : [
            `file-loader?name=assets/[path][name]-[hash:10].[ext]&context=${path.join(FEB_PATH.project, 'src/')}`,
            'image-webpack-loader'
          ]
        },
        {
          test: /\.css$/,
          loader: !FEB_PROD
            ? 'style-loader!css-loader'
            : ExtractTextPlugin.extract('style-loader', 'css-loader', {
              publicPath: cssPublicPath
            })
        },
        {
          test: /\.scss$/,
          loader: !FEB_PROD
            ? 'style-loader!css-loader!postcss-loader!sass-loader'
            : ExtractTextPlugin.extract('style-loader', 'css-loader!postcss-loader!sass-loader', {
              publicPath: cssPublicPath
            })
        }
      ]
    },
    vue: {
      loaders: {
        js: `babel-loader?${JSON.stringify(babelConfig)}`,
        scss: vueScssConfig,
        css: vueCssConfig
      },
      postcss: getPostCss()
    },
    postcss: () => getPostCss(),
    imageWebpackLoader: {
      pngquant: {}
    },
    plugins: !FEB_PROD
      ? []
      : [new ExtractTextPlugin('assets/css/[name].css')]
  };
};
