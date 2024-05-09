module.exports = {
  presets: ['module:@react-native/babel-preset'],

  plugins: [
    //===>>This should always be the LAST (react-native-reanimated/plugin)
    [
      'react-native-reanimated/plugin'
    ]
    //===>>This should always be the LAST (react-native-reanimated/plugin)
  ]
};
