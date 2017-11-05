module.exports = {
  presets: [
    'babel-preset-es2015',
    'babel-preset-stage-2'
  ].map(require.resolve), // require.resolve 为了转化成绝对路径
  plugins: ['babel-plugin-transform-runtime'].map(require.resolve),
  comments: false,
  babelrc: false
};
