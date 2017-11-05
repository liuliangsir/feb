const imagemin = require('gulp-imagemin'); // imagemin 图片压缩
const pngquant = require('imagemin-pngquant'); // pngquant png 图片压缩

exports.gulp = function () {
  // 读取 img 配置
  const config = global.FEB_CONFIG.img;

  // imagemin 默认插件
  const plugins = [imagemin.gifsicle(), imagemin.jpegtran(), imagemin.optipng(), imagemin.svgo()];

  // pngquant 可选
  if (config.pngquant) {
    plugins.push(pngquant(typeof config.pngquant === 'object' ? config.pngquant : undefined));
  }

  return plugins;
};
