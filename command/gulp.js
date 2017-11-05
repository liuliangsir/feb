const path = require('path');
const fs = require('fs');

const chalk = require('chalk');
const shell = require('shelljs');
const version = require('../package.json').version;

module.exports = function (env) {
  console.log('\n');
  console.log(`正在使用 FEB ${chalk.green(version)} 执行 ${chalk.yellow(env)} 任务...`);

  if (!fs.existsSync('./src')) {
    console.log(chalk.red.bold('出错了～找不到源文件 src 目录！请检查当前路径是否正确！'));
    shell.exit(0);
  }

  process.argv.splice(2, process.argv.length);
  process.argv.push(env);

  process.argv.push(
    '--gulpfile',
    // __dirname 是全局变量，表示当前文件所在目录
    path.resolve(__dirname, '../lib/gulpfile.js')
  );

  require('gulp/bin/gulp'); // eslint-disable-line global-require
};
