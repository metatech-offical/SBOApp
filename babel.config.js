module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    [
      'module:react-native-dotenv',
      {
        moduleName: '@env',
        path: '.env',
        blacklist: null,
        whitelist: null,
        safe: false,
        allowUndefined: true,
      },
    ],
    [
      'module-resolver',
      {
        root: ['./'],
        alias: {
          '@assets': './src/assets',
          '@components': './src/components',
          '@constant': './src/constant',
          '@container': './src/container',
          '@navigation': './src/navigation',
          '@rtkServices': './src/rtkServices',
          '@socket': './src/socket',
          '@store': './src/store',
          '@translation': './src/translation',
          '@types': './src/types',
          '@utils': './src/utils',
          '@hooks': './src/hooks',
        },
      },
    ],
    'react-native-reanimated/plugin',
  ],
};
