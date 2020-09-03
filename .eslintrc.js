module.exports = {
  root: false,

  env: {
    node: false
  },

  extends: [
    'plugin:vue/essential',
    '@vue/standard'
  ],

  parserOptions: {
    parser: 'babel-eslint'
  },

  rules: {
    'no-console': 'off',
    'no-debugger': 'off',
    'space-before-function-paren': 0
  },

  extends: [
    'plugin:vue/essential',
    '@vue/standard'
  ]
}
