const gulp = require('gulp');
const sass = require('gulp-sass'); // sass
const sourcemaps = require('gulp-sourcemaps'); // sourcemap，压缩后的代码索引
const postcss = require('gulp-postcss');  // css 预处理
// const pxtorem = require('postcss-pxtorem'); // 转换 px 为 rem
// const autoprefixer = require('autoprefixer'); // 自动浏览器前缀
// const cssnano = require('cssnano'); // css 压缩
const bs = require('browser-sync').get('feb');
const gulpif = require('gulp-if'); // gulp 流条件分支
const gulpIgnore = require('gulp-ignore'); // gulp 流忽略
const tmtsprite = require('gulp-tmtsprite');   // 雪碧图合并
const base64 = require('gulp-base64'); // base64
const gutil = require('gulp-util');
const sassError = require('gulp-sass-error').gulpSassError;

let processors;
const getPostCss = require('../config/postcss');

function css(cb) {
  // webpack 处理 css
  if (global.FEB_CONFIG.js.assets) {
    gutil.log(gutil.colors.yellow('正在使用 webpack 处理 css！'));
    if (cb) cb();
    return false;
  }

  const paths = global.FEB_PATH;

  if (!processors) processors = getPostCss();

  if (!global.FEB_PROD) {
    // 开发环境 dev
    return gulp.src(paths.src.css, { base: paths.src.cssBase })
      .pipe(sourcemaps.init())
      .pipe(sass().on('error', sass.logError))
      // postcss
      .pipe(postcss(processors))
      .pipe(sourcemaps.write())
      .pipe(gulp.dest(paths.dev.css))
      .pipe(gulpif(!global.FEB_PROD && global.FEB_CONFIG.project.reload, bs.stream()));
  }
  // 生产环境 output
  return gulp.src(paths.src.css, { base: paths.src.cssBase })
    .pipe(sass().on('error', sassError(true))) // 异常中断程序
    // 雪碧图
    .pipe(tmtsprite({ margin: 4 }))
    .pipe(gulpif('*.png', gulp.dest(paths.output.sprite)))
    .pipe(gulpIgnore.exclude('*.png'))
    // base64
    .pipe(base64({
      baseDir: paths.output.css,
      // debug: true,
      extensions: [/(inline|base64)/]
    }))
    // postcss
    .pipe(postcss(processors))
    .pipe(gulp.dest(paths.output.css));
}

module.exports = css;
