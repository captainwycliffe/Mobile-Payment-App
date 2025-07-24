module.exports = function(api) {
    api.cache(true);
    return {
      presets: ['babel-preset-expo'],
      plugins: [
        [
          'module-resolver',
          {
            root: ['./'],
            alias: {
              '@': './src',
              '@components': './src/components',
              '@screens': './src/screens',
              '@services': './src/services',
              '@types': './src/types',
              '@utils': './src/utils',
              '@styles': './src/styles',
              '@hooks': './src/hooks',
              '@context': './src/context',
              '@navigation': './src/navigation',
            },
          },
        ],
      ],
    };
  };