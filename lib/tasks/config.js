const cosmiconfig = require('cosmiconfig');
const _ = require('lodash');
const gutil = require('gulp-util');
const util = require('util');
const is = require('../../util/is');
const cdnUtil = require('../../util/cdn');

// 默认配置
const defaultConfig = require('../config/feb.config.js');

// 读取配置
function readConfig() {
  // 异步读取，返回 promise
  return cosmiconfig('feb').load(process.env.INIT_CWD).then((result) => {
    const userConfig = result.config;
    // 当 js assets 启用时，默认打开 babel 和 hmr
    if (userConfig.js && userConfig.js.assets) {
      defaultConfig.js.babel = true;
      defaultConfig.js.hmr = true;
    }

    // CDN 配置
    if (userConfig.project && is.String(userConfig.project.cdn)) {
      userConfig.project.cdn = cdnUtil.genCdnObj(userConfig.project.cdn);
    }

    // 读取值和默认值合并
    global.FEB_CONFIG = _.defaultsDeep(userConfig, defaultConfig);

    // 当 js hmr 启用时，打开 wds
    if (userConfig.js && userConfig.js.hmr) {
      global.FEB_CONFIG.js.wds = true;
    }

    // debug
    if (global.FEB_CONFIG.project.debug) {
      gutil.log('当前使用的 FEB 配置如下：');
      console.log(util.inspect(global.FEB_CONFIG, { depth: null, colors: true }));
    }
  }).catch((err) => {
    // 没有 feb.config.js，则使用默认值了
    console.log(err);
    global.FEB_CONFIG = defaultConfig;
    gutil.log('没有找到 feb.config.js 配置文件，正在使用默认配置...');
  });
}

module.exports = readConfig;

