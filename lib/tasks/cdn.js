const path = require('path');
const gulp = require('gulp');
const gulpReplace = require('gulp-replace');
const cdnUtil = require('../../util/cdn');


// 添加 css cdn
function cdnCss(cb) {
  const FEB_PATH = global.FEB_PATH;
  const FEB_CONFIG = global.FEB_CONFIG;

  if (!FEB_CONFIG.project.cdn || FEB_CONFIG.project.cdn.ignoreCss || FEB_CONFIG.js.assets) {
    if (cb) cb();
    return false;
  }

  return gulp.src([FEB_PATH.output.allCss], { base: FEB_PATH.output.dir })
    .pipe(gulpReplace(/\.\.\/(img|misc|data|sprite)\//g, match =>
      `${cdnUtil.getProtocol(FEB_CONFIG.project.cdn.protocol)}//${path.posix.join(cdnUtil.getPath(FEB_CONFIG.project.cdn.path), 'assets/assets', match)}`
    ))
    .pipe(gulp.dest(FEB_PATH.output.dir));
}

// 添加 html 和 js cdn
function cdnHtmlJs(cb) {
  const FEB_PATH = global.FEB_PATH;
  const FEB_CONFIG = global.FEB_CONFIG;

  if (!FEB_CONFIG.project.cdn) {
    if (cb) cb();
    return false;
  }

  const srcArray = [FEB_PATH.output.allHtml];
  if (!FEB_CONFIG.js.assets) srcArray.push(FEB_PATH.output.allJs);

  return gulp.src(srcArray, { base: FEB_PATH.output.dir })
    .pipe(gulpReplace(/(\.\/|\/)?assets\//g, match =>
      `${cdnUtil.getProtocol(FEB_CONFIG.project.cdn.protocol)}//${path.posix.join(cdnUtil.getPath(FEB_CONFIG.project.cdn.path), match)}`
    ))
    .pipe(gulp.dest(FEB_PATH.output.dir));
}

module.exports = gulp.parallel(cdnHtmlJs, cdnCss);
