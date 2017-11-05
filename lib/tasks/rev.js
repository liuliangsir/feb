const gulp = require('gulp');
const revDel = require('gulp-rev-delete-original');
const gulpRev = require('gulp-rev');
const gulpRevReplace = require('gulp-rev-replace');

// 添加版本号
function rev(cb) {
  const FEB_PATH = global.FEB_PATH;
  const FEB_CONFIG = global.FEB_CONFIG;

  if (!global.FEB_CONFIG.project.rev) {
    if (cb) cb();
    return false;
  }

  let srcArray = [
    FEB_PATH.output.allImg,
    FEB_PATH.output.allSprite,
    FEB_PATH.output.allMisc,
    FEB_PATH.output.allCss,
    FEB_PATH.output.allJs
  ];
  if (FEB_CONFIG.js.assets) {
    srcArray = [FEB_PATH.output.allCss, FEB_PATH.output.allJs];
  }

  return gulp.src(srcArray,
    { base: FEB_PATH.output.dir })
    .pipe(gulpRev())
    .pipe(revDel({
      exclude: /(.html|.htm)$/
    }))
    .pipe(gulp.dest(FEB_PATH.output.dir))
    .pipe(gulpRev.manifest())
    .pipe(gulp.dest(FEB_PATH.output.dir));
}

function modifyManifest(filename) {
  return filename.replace('assets/', '');
}

// 添加版本号
function revReplace(cb) {
  const FEB_PATH = global.FEB_PATH;

  if (!global.FEB_CONFIG.project.rev) {
    if (cb) cb();
    return false;
  }

  const manifest = gulp.src(FEB_PATH.output.revManifest);

  return gulp.src([FEB_PATH.output.allHtml, FEB_PATH.output.allCss, FEB_PATH.output.allJs],
    { base: FEB_PATH.output.dir })
    .pipe(gulpRevReplace({
      manifest,
      modifyUnreved: modifyManifest,
      modifyReved: modifyManifest
    }))
    .pipe(gulp.dest(FEB_PATH.output.dir));
}


module.exports = gulp.series(rev, revReplace);
