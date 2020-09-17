module.exports = function(path) {
    return {
      devServer: {
        stats: 'errors-only',
        overlay: true,
        contentBase: path,
        historyApiFallback: true
      },
    };
  };