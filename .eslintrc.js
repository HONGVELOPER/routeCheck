module.exports = {
  root: true,
  env: {
    browser: true,
    node: true
  },
  parserOptions: {
    parser: 'babel-eslint'
  },
  extends: [
    '@nuxtjs',
    'plugin:nuxt/recommended'
  ],
  globals : {
    "kakao": false
  },
  plugins: [
  ],
  // add your custom rules here
  rules: {}
}
