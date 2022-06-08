module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    ["module:react-native-dotenv", {
      "moduleName": "@env",
      "path": ".env",
      "blocklist": null,
      "allowlist": ["API_URL"],
      "safe": false,
      "allowUndefined": true
    }],
    [require.resolve('babel-plugin-module-resolver'), {
      cwd: 'babelrc',
      extensions: ['.ts', '.tsx', '.js', '.ios.js', '.android.js'],
      alias: {
        '@': './src'
      }
    }]
  ]
};