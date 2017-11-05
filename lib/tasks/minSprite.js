const gulp = require('gulp');
const imagemin = require('gulp-imagemin'); // imagemin 图片压缩
const imageminConfig = require('../config/imagemin').gulp;

function minSprite(cb) {
  const paths = global.FEB_PATH;

  // webpack 处理
  if (global.FEB_CONFIG.js.assets) {
    if (cb) cb();
    return false;
  }

  return gulp.src(paths.output.allSprite, { base: paths.output.sprite })
    .pipe(imagemin(imageminConfig()))
    .pipe(gulp.dest(paths.output.sprite));
}

module.exports = minSprite;
