const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = function(sourcePath, destinationPath) {
    return {
      plugins: [
        new CopyWebpackPlugin({patterns: [                            
          {
            from: sourcePath + "/images/logo.png",
            to: destinationPath + "/images/",
            flatten: true
          },
          {
            from: sourcePath + "/favicon.png",
            to: destinationPath + "/",
            flatten: true
          }
        ]})
      ],
    };
  };
  