const gulp = require('gulp');
const bs = require('browser-sync').get('feb');
const imagemin = require('gulp-imagemin'); // imagemin 图片压缩
const gulpif = require('gulp-if'); // gulp 流条件分支
const debounce = require('lodash.debounce');
const gutil = require('gulp-util');
const imageminConfig = require('../config/imagemin').gulp;


const debounceReload = debounce(bs.reload, 200);

// 复制 assets 操作函数
function copyAssetsHandler(type, file) {
  const paths = global.FEB_PATH;

  const filePath = file || paths.src[type];

  const destDir = !global.FEB_PROD ? paths.dev.assets : paths.output.assets;

  return gulp.src(filePath, { base: paths.src.dir })
    // 生产模式压缩一下图片
    .pipe(gulpif(global.FEB_PROD, imagemin(imageminConfig())))
    .pipe(gulp.dest(destDir))
    .on('end', () => {
      if (!global.FEB_PROD && global.FEB_CONFIG.project.reload) debounceReload();
    });
}

function copyImg(cb) {
  if (global.FEB_CONFIG.js.assets) {
    gutil.log(gutil.colors.yellow('正在使用 webpack 处理 img！'));
    if (cb) cb();
    return false;
  }
  return copyAssetsHandler('img');
}

function copySlice(cb) {
  if (global.FEB_CONFIG.js.assets) {
    gutil.log(gutil.colors.yellow('正在使用 webpack 处理 slice！'));
    if (cb) cb();
    return false;
  }
  return copyAssetsHandler('slice');
}

function copyMisc(cb) {
  if (global.FEB_CONFIG.js.assets) {
    gutil.log(gutil.colors.yellow('正在使用 webpack 处理 misc！'));
    if (cb) cb();
    return false;
  }
  return copyAssetsHandler('misc');
}

function copyData() {
  return copyAssetsHandler('data');
}

module.exports = {
  assets: copyAssetsHandler,
  img: copyImg,
  slice: copySlice,
  misc: copyMisc,
  data: copyData
};
