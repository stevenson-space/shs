module.exports = {
  root: true,
  parserOptions: {
    parser: 'babel-eslint',
    sourceType: "module"
  },
  extends: [
    'airbnb-base',
    'plugin:vue/recommended'
  ],
  rules: {
    // override/add rules settings here, such as:
    // 'vue/no-unused-vars': 'error'
  }
}