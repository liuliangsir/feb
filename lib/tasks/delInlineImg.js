const del = require('del');
const path = require('path');

// 删除目录
function delInlineImg() {
  const FEB_PATH = global.FEB_PATH;

  return del([
    path.join(FEB_PATH.output.img, 'inline'),
    path.join(FEB_PATH.output.img, 'base64')
  ], { force: true });
}

module.exports = delInlineImg;
