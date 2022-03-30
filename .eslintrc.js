module.exports = {
  env: {
    browser: true,
    commonjs:true,
    es2021: true
  },
  extends: [
    'standard',
    'plugin:prettier/recommended'
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  rules: {
    'prettier/prettier': 'error',
    'no-unused-vars': 'warn',
    'no-undef': 'warn',
    'prefer-const': 'warn',
    'no-useless-return': 'warn'
  },
  settings: {
        react: {
            version: "detect" // Detect react version
        }
    }
}
