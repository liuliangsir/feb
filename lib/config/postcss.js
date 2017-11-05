const autoprefixer = require('autoprefixer'); // 自动浏览器前缀
const pxtorem = require('postcss-pxtorem'); // 转换 px 为 rem
const cssnano = require('cssnano'); // css 压缩
const is = require('../../util/is');

const postcssConfig = {
  autoprefixer: {
    browsers: [
      'ie > 6',
      'ff > 1',
      'safari > 1',
      'chrome > 1',
      'Android >= 2.3',
      'iOS >= 7'
    ],
    cascade: true
  },
  px2rem: {
    rootValue: 75,
    propWhiteList: [],
    minPixelValue: 2
  },
  cssnano: {
    autoprefixer: false,
    zindex: false,
    reduceIdents: false,
    discardUnused: false,
    mergeIdents: false,
    minifyFontValues: { removeQuotes: false }
  }
};

const processors = [];

module.exports = function () {
  // 配置
  const config = global.FEB_CONFIG.css;

  if (processors.length > 0) return processors;

  // autoprefixer
  if (config.autoprefixer) {
    processors.push(autoprefixer(is.Object(config.autoprefixer)
      ? config.autoprefixer
      : postcssConfig.autoprefixer
    ));
  }

  // px2rem
  if (config.px2rem) {
    const px2remConfig = postcssConfig.px2rem;
    if (is.Number(config.px2rem)) {
      px2remConfig.rootValue = config.px2rem;
    }
    processors.push(pxtorem(is.Object(config.px2rem)
      ? config.px2rem
      : px2remConfig
    ));
  }

  // 压缩
  if (global.FEB_PROD) {
    processors.push(cssnano(config.cssnano
      ? config.cssnano
      : postcssConfig.cssnano
    ));
  }

  return processors;
};
