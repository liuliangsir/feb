const babelConfig = require('../babelrc');

module.exports = function () {
  return {
    module: {
      loaders: [
        {
          test: /\.js$/,
          loader: require.resolve('babel-loader'),
          exclude: /node_modules/,
          query: babelConfig
        }
      ]
    }
  };
};
