const gulp = require('gulp');
const requireDir = require('require-dir');
// 读取 tasks 目录
const tasks = requireDir('./tasks', { recurse: true });

// 检查是否 output，设置 global.FEB_PROD 全局属性
if (process.argv.indexOf('output') > -1) {
  global.FEB_PROD = true;
  global.production = true; // 兼容旧的项目
} else {
  global.FEB_PROD = false;
  global.production = false; // 兼容旧的项目
}

// 开发模式 dev
gulp.task('dev', gulp.series(
  tasks.config,
  tasks.processPath,
  tasks.clean,
  gulp.parallel(
    tasks.copy.img,
    tasks.copy.slice,
    tasks.copy.misc,
    tasks.copy.data,
    tasks.html,
    tasks.css,
    tasks.js,
    tasks.static
  ),
  tasks.watch,
  tasks.bs
));

// 生成模式 output
gulp.task('output', gulp.series(
  tasks.config,
  tasks.processPath,
  tasks.clean,
  tasks.img,
  tasks.css,
  gulp.parallel(
    tasks.minSprite,
    tasks.copy.data,
    tasks.copy.misc,
    tasks.html,
    tasks.js,
    tasks.static,
    tasks.delInlineImg
  ),
  tasks.rev,
  tasks.cdn,
  tasks.bs
));
