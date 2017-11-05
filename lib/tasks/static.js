const gulp = require('gulp');
const bs = require('browser-sync').get('feb');
const debounce = require('lodash.debounce');


const debounceReload = debounce(bs.reload, 200);

function copyStatic() {
  const FEB_PATH = global.FEB_PATH;

  const destDir = !global.FEB_PROD ? FEB_PATH.dev.dir : FEB_PATH.output.dir;

  return gulp.src(FEB_PATH.src.static)
    .pipe(gulp.dest(destDir))
    .on('end', () => {
      if (!global.FEB_PROD && global.FEB_CONFIG.project.reload) debounceReload();
    });
}

module.exports = copyStatic;
