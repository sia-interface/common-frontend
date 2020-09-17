const FaviconsWebpackPlugin = require('favicons-webpack-plugin');

module.exports = function(path, publicPath) {
  return {
    plugins: [
      new FaviconsWebpackPlugin({
        logo: path,
        cache: true,
        mode: "light",
        publicPath,
        prefix: "/",
        favicons: {
          icons: {
            android: false,
            appleIcon: false,
            appleStartup: false,  
            coast: false,
            firefox: false,
            windows: false,  
            yandex: false
          }
        }
      }),
    ],
  };
};
