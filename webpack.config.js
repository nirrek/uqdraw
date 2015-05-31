var webpack = require('webpack');

module.exports = {
  entry: {
    app: ['webpack/hot/dev-server', './js/app.jsx']
  },
  output: {
    path: './build',
    filename: 'bundle.js'
  },
  module: {
    loaders: [
      { test: /\.jsx?$/, exclude: /node_modules/, loader: 'babel'},
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
  devtool: "source-map"
};
