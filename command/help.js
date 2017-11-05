const shell = require('shelljs');
const opn = require('opn');

module.exports = function () {
  console.log('正在使用浏览器打开帮助文档...如没有反应请手动访问 http://feteam.yypm.com/feb/');
  opn('http://feteam.yypm.com/feb/');
  setTimeout(() => {
    shell.exit(0);
  }, 200);
};
