module.exports = function() {
    return {
      module: {
        rules: [
          {
            test: /\.ts(x?)$/,
            use: ['cache-loader','ts-loader'],
            exclude: /node_modules/, 
          },
        ],
      },
    };
  };