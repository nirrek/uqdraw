var webpack = require('webpack');

module.exports = {
  entry: {
    app: ['./js/app.js']
  },
  output: {
    path: './build',
    filename: 'bundle.js'
  },
  module: {
    loaders: [
      { test: /\.js?$/, loaders: ['babel'], exclude: /node_modules/},
      { test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader?stage=1'},
      { test: /\.css$/, loader: 'style!css' },
      {
        test: /\.scss$/,
        loader: 'style!css!sass'
      }
    ]
  },
  plugins: [
    new webpack.NoErrorsPlugin()
  ],
};
