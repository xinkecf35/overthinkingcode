module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
  },
  extends: [
    '@nuxtjs',
    '@nuxtjs/eslint-config',
    'google',
    'prettier',
    'plugin:prettier/recommended',
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
        ignorePattern: '.*d=".+"',
      },
    ],
    semi: [2, 'always'],
  },
};
