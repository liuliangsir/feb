module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: 'airbnb-base',
  rules: {
    'no-console': 0,
    'comma-dangle': ["error", {"functions": "never"}],
    'import/no-dynamic-require': 0,
    'func-names': 0,
  }
};
