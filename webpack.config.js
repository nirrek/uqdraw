var webpack = require('webpack');

module.exports = {
  entry: {
    app: ['webpack/hot/dev-server', './js/app.js']
  },
  output: {
    path: './build',
    filename: 'bundle.js'
  },
  module: {
    loaders: [
      { test: /\.js?$/, loaders: ['react-hot', 'babel'], exclude: /node_modules/},
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
