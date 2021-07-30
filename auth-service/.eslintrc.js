module.exports = {
  env: {
    browser: true,
    es2021: true,
    mocha: true,
    node: true,
  },
  extends: [
    'airbnb-base',
  ],
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module',
  },
  rules: {
    camelcase: 'off',
    'no-plusplus': 'off',
    'max-len': 'off',
    'no-shadow': 'off',
    'no-process-env': 'off',
    'no-unused-expressions': 'off',
    'new-cap': 0,
  },
};
