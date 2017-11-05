const gulp = require('gulp');
const assemble = require('assemble')(); // assemble 模板
const bs = require('browser-sync').get('feb'); // browser sync
const rename = require('gulp-rename'); // 重命名
const htmlmin = require('gulp-htmlmin'); // html min 压缩
const gulpif = require('gulp-if'); // gulp 流条件分支


function html() {
  const paths = global.FEB_PATH;

  // 配置
  const config = global.FEB_CONFIG.html;

  // 目标目录
  const destDir = !global.FEB_PROD ? paths.dev.html : paths.output.html;

  // 使用 assemble 编译 html
  assemble.partials(paths.src.html.partials);
  assemble.layouts(paths.src.html.layouts);
  assemble.pages(paths.src.html.pages);

  return assemble.toStream('pages')
    .pipe(assemble.renderFile('hbs', { __PROD__: global.FEB_PROD, __DEV__: !global.FEB_PROD }))
    .pipe(rename({ extname: '.html' }))
    // html min
    .pipe(gulpif(global.FEB_PROD, htmlmin(config.htmlmin ? config.htmlmin : { minifyJS: true })))
    .pipe(gulp.dest(destDir))
    .pipe(gulpif(!global.FEB_PROD && global.FEB_CONFIG.project.reload, bs.stream()));
    // .on('end', () => {
    //   if (!global.FEB_PROD && global.FEB_CONFIG.project.reload) bs.reload();
    // });
}


module.exports = html;
