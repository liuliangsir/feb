module.exports = {
  root: true,
  globals: {
    PIE: true,
    $: true,
    Vue: true,
    Regular: true,
    __DEV__: true,
    __PROD__: true
  },
  env: {
    'browser': true
  },
  extends: 'airbnb-base/legacy',
  rules: {
    'no-debugger': global.FEB_PROD ? 2 : 0,
    'no-console': global.FEB_PROD ? 1 : 0,
    'func-names': 0,
    'no-new': 0,
    'linebreak-style': 0
  }
};
