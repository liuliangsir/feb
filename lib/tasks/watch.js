const gulp = require('gulp');
const del = require('del');
const gutil = require('gulp-util');
const path = require('path');
const debounce = require('lodash.debounce');
const asyncDone = require('async-done');

const bs = require('browser-sync').get('feb');
// const paths = require('./paths');
const html = require('./html');
const css = require('./css');
const js = require('./js');
const copy = require('./copy');
const copyStatic = require('./static');

const debounceReload = debounce(bs.reload, 200);

// 监听文件
function watch(cb) {
  const paths = global.FEB_PATH;
  const FEB_CONFIG = global.FEB_CONFIG;

  // 监听 src 目录，返回一个 watcher 对象, ignored 为忽略文件
  const watcher = gulp.watch(paths.src.dir, { cwd: paths.project, ignored: /_$/ });

  function watchHandler(type, file, done) {
    const target = file.split(path.sep)[1];  // 判断来自 src 下的哪个目录
    let destFilePath; // 目标文件目录

    // 判断来自 html 里的哪个目录
    const tplType = file.split(path.sep)[2];

    // 判断来自 css 里的哪个目录
    const cssType = path.parse(file).dir.split(path.sep)[2];

    // console.log(target);
    switch (type) {
      case 'change':
        gutil.log(file, 'has been changed');
        break;
      case 'add':
        gutil.log(file, 'has been added');
        break;
      case 'unlink':
        gutil.log(file, 'has been deleted');
        break;
      default:
        break;
    }

    // 使用 webpack 处理 assets 的情况
    if (FEB_CONFIG.js.assets && target !== 'html' && target !== 'data' && target !== 'static') {
      gutil.log(gutil.colors.yellow(`正在使用 webpack 处理 ${target}！`));
      js();
      if (done) done();
      return;
    }

    switch (target) {

      case 'html':

        // console.log(tplType);

        if (type === 'unlink' && tplType === 'pages') {
          // 如果是删除 pages 目录下的，则要删除目标 html
          // 这里考虑了嵌套目录（例如：src/html/pages/a/a.hbs，目标会是 dev/a/a.html）
          destFilePath = file.replace(/^src[/\\]html[/\\]pages/, 'dev').replace(/\.hbs$/, '.html');
          // console.log(destFilePath);
          del([path.join(paths.project, destFilePath)], { force: true }).then(() => {
            if (!global.FEB_PROD && FEB_CONFIG.project.reload) debounceReload();
          });
        } else {
          html();
        }

        break;

      case 'css':
        // console.log(path.parse(file).dir);

        if (type === 'unlink' && !cssType) {
          // 这里只考虑 css 目录下的 scss 文件，没考虑子目录里的
          destFilePath = path.join('dev/assets/css', path.basename(file)).replace(/\.scss$/, '.css');
          // console.log(path.join(paths.project, destFilePath));
          del([path.join(paths.project, destFilePath)], { force: true }).then(() => {
            if (!global.FEB_PROD && FEB_CONFIG.project.reload) debounceReload();
          });
        } else {
          css();
        }
        break;

      case 'img':
      case 'misc':
      case 'slice':
      case 'data':

        if (type === 'unlink') {
          // 为了照顾 Mac 和 Win，所以用 path.join，而不直接 replace
          destFilePath = path.join('dev/assets', file.replace(/^src/, ''));
          // console.log(destFilePath);
          del([path.join(paths.project, destFilePath)], { force: true }).then(() => {
            if (!global.FEB_PROD && FEB_CONFIG.project.reload) debounceReload();
          });
        } else {
          copy.assets(target, path.join(paths.project, file));
        }
        break;
      case 'js':
        js();
        break;
      case 'static':
        if (type === 'unlink') {
          destFilePath = file.replace(/^src(\\|\/)static/, '');
          // console.log(destFilePath);
          del([path.join(paths.dev.dir, destFilePath)], { force: true }).then(() => {
            if (!global.FEB_PROD && FEB_CONFIG.project.reload) debounceReload();
          });
        } else {
          copyStatic();
        }
        break;
      default:
        break;
    }

    if (done) done();
  }

  /**
   * debounce, copy from glob-watcher
   */

  let queued = false;
  let running = false;

  // function runComplete(err) {
  //   running = false;
  //
  //   if (err) {
  //     watcher.emit('error', err);
  //   }
  //
  //   // If we have a run queued, start onChange again
  //   if (queued) {
  //     queued = false;
  //     onChange();
  //   }
  // }

  function onChange(type, file) {
    if (running) {
      queued = true;
      return;
    }

    running = true;
    asyncDone(watchHandler.bind(null, type, file), (err) => {
      running = false;

      if (err) {
        watcher.emit('error', err);
      }

      // If we have a run queued, start onChange again
      if (queued) {
        queued = false;
        onChange();
      }
    });
  }


  // watcher 对象监听
  watcher
  // 更改
    .on('change', debounce(onChange, 200).bind(null, 'change'))
    // 增加
    .on('add', (file) => {
      watchHandler('add', file);
    })
    // 删除
    .on('unlink', (file) => {
      watchHandler('unlink', file);
    });

  cb();
}

module.exports = watch;
