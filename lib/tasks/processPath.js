const path = require('path');
const _ = require('lodash');

// 项目目录
const projectCwd = process.env.INIT_CWD;

/*
 处理路径成绝对路径
 */
function pathToAbsolute(value, key) {
  if (typeof value === 'object') {
    _.assign(value, _.mapValues(value, pathToAbsolute));
    // console.log(value);
  } else if (typeof value === 'string' && key !== 'cwd' && !path.isAbsolute(value)) {
    return path.join(projectCwd, value);
  }
  return value;
}

function processPath(cb) {
  // 允许自定义开发和输出目录
  const devPath = global.FEB_CONFIG.project.path.dev;
  const outputPath = global.FEB_CONFIG.project.path.output;

  const paths = {
    // 项目目录
    project: projectCwd,
    // FEB 里的模块目录
    module: path.join(process.cwd(), '../node_modules'),
    // 源码目录
    src: {
      dir: './src',
      html: {
        partials: './src/html/partials/**/*.hbs',
        layouts: './src/html/layouts/**/*.hbs',
        pages: './src/html/pages/**/*.hbs'
      },
      cssBase: './src/css',
      css: './src/css/**/*.scss',
      imgBase: './src/img',
      img: './src/img/**/*.{jpg,png,gif,jpeg,JPG,PNG,GIF,JPEG}',
      slice: './src/slice/**/*.{png,PNG}',
      misc: './src/misc/**/*',
      data: './src/data/**/*',
      static: './src/static/**/*'
    },
    // 开发预览目录
    dev: {
      dir: devPath,
      assets: path.join(devPath, './assets'),
      css: path.join(devPath, './assets/css'),
      html: devPath,
      js: path.join(devPath, './assets/js')
    },
    // 输出目录
    output: {
      dir: outputPath,
      assets: path.join(outputPath, './assets'),
      sprite: path.join(outputPath, './assets/sprite'),
      data: path.join(outputPath, './assets/data'),
      css: path.join(outputPath, './assets/css'),
      img: path.join(outputPath, './assets/img'),
      html: outputPath,
      js: path.join(outputPath, './assets/js'),
      all: path.join(outputPath, './**/*'),
      allImg: path.join(outputPath, './assets/img/**/*'),
      allMisc: path.join(outputPath, './assets/misc/**/*'),
      allSprite: path.join(outputPath, './assets/sprite/**/*'),
      allData: path.join(outputPath, './assets/data/**/*'),
      allHtml: path.join(outputPath, './**/*.html'),
      allCss: path.join(outputPath, './assets/css/**/*.css'),
      allJs: path.join(outputPath, './assets/js/**/*'),
      revManifest: path.join(outputPath, './rev-manifest.json')
    }

  };

  global.FEB_PATH = _.mapValues(paths, pathToAbsolute);

  if (cb) cb();
}

module.exports = processPath;
