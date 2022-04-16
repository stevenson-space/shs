module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: [
    'plugin:vue/essential',
    '@vue/airbnb',
    '@vue/typescript/recommended',
  ],
  parserOptions: {
    ecmaVersion: 2020,
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-empty-function': 'off',
    'max-len': 'off',
    'no-plusplus': 'off',
    'no-restricted-syntax': [
      'error',
      'ForInStatement',
      'LabeledStatement',
      'WithStatement',
    ],
    indent: ['error', 2, { SwitchCase: 1 }],
    radix: 'off',
    'no-lonely-if': 'off',
    'no-param-reassign': 'off',
    'vue/no-unused-components': 'warn',
    'no-nested-ternary': 'off',
    'no-use-before-define': ['error', { functions: false, classes: false }],
    'lines-between-class-members': 'off',
    'object-curly-newline': 'off',
  'prefer-destructuring': ['error', { array: false, object: true }],
    'vue/multi-word-component-names': 'off',
    'vuejs-accessibility/click-events-have-key-events': 'off',
    'vuejs-accessibility/form-control-has-label': 'off',
    'vuejs-accessibility/alt-text': 'off',
  },
  overrides: [
    {
      // enable the rule specifically for TypeScript files
      files: ['*.ts', '*.tsx'],
      rules: {
        '@typescript-eslint/explicit-function-return-type': ['error'],
        '@typescript-eslint/explicit-module-boundary-types': ['error'],
      },
    },
  ],
};
