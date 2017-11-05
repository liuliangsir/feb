const gulp = require('gulp');
const imagemin = require('gulp-imagemin'); // imagemin 图片压缩
const gulpIgnore = require('gulp-ignore'); // gulp 流忽略
const gutil = require('gulp-util');
const imageminConfig = require('../config/imagemin').gulp;


function img(cb) {
  const paths = global.FEB_PATH;

  // webpack 处理 img
  if (global.FEB_CONFIG.js.assets) {
    gutil.log(gutil.colors.yellow('正在使用 webpack 处理 img！'));
    if (cb) cb();
    return false;
  }

  return gulp.src(paths.src.img, { base: paths.src.imgBase })
    .pipe(gulpIgnore.exclude('test/**/*'))
    .pipe(imagemin(imageminConfig()))
    .pipe(gulp.dest(paths.output.img));
}

module.exports = img;
