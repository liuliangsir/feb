const del = require('del');

// 删除目录
function clean() {
  const paths = global.FEB_PATH;

  const dir = global.FEB_PROD ? paths.output.dir : paths.dev.dir;
  return del([dir], { force: true });
}

module.exports = clean;
