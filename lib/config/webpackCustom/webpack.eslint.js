const fs = require('fs');
const path = require('path');
const util = require('util');
const gutil = require('gulp-util');


module.exports = function () {
  const FEB_PATH = global.FEB_PATH;
  const FEB_CONFIG = global.FEB_CONFIG;

  // ESLint 配置文件地址
  let eslintConfigFile;

  // 如果项目里有 eslintrc.js
  if (fs.existsSync(path.join(FEB_PATH.project, '.eslintrc.js'))) {
    eslintConfigFile = path.join(FEB_PATH.project, '.eslintrc.js');
  } else {
    const esVersion = FEB_CONFIG.js.babel ? 'es6' : 'es5';
    eslintConfigFile = path.join(__dirname, `../.eslintrc.${esVersion}.js`);
  }

  // debug 开启打印 eslint 配置
  if (FEB_CONFIG.project.debug) {
    gutil.log(`当前使用 ESLint 配置文件 ${eslintConfigFile}，内容如下：`);
    console.log(util.inspect(require(eslintConfigFile), { // eslint-disable-line global-require
      depth: null,
      colors: true
    }));
  }

  return {
    module: {
      preLoaders: [
        {
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /node_modules/
        }
      ]
    },
    eslint: {
      configFile: eslintConfigFile,
      failOnError: global.FEB_PROD,
      formatter: require('eslint-friendly-formatter') // eslint-disable-line global-require
    }
  };
};
