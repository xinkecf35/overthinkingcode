module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
  },
  parserOptions: {
    parser: 'babel-eslint',
  },
  extends: [
    '@nuxtjs',
    'prettier',
    'prettier/vue',
    'plugin:prettier/recommended',
    'plugin:nuxt/recommended',
    'google',
  ],
  plugins: ['prettier'],
  // add your custom rules here
  rules: {
    'max-len': [
      2,
      {
        code: 80,
        ignoreTemplateLiterals: true,
        ignoreStrings: true,
        ignorePattern: ".*d=\".+\""
      },
    ],
    semi: [2, 'always'],
  },
};
