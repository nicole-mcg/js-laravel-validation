var path = require('path');

module.exports = {
  target: 'node',
  mode: 'development',
  entry: './src/api.js',
  output: {
    library: 'validation',
    libraryExport: 'validation',
    libraryTarget: 'var',
    path: path.resolve(__dirname, 'dist'),
    filename: 'api.bundle.js'
  },
  module: {
    rules: [
        {
            test: /\.m?js$/,
            exclude: [/(node_modules)/, /\*.test.js/],
            use: {
                loader: 'babel-loader'
            },
        }
    ]
  }
};
