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
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loaders: [
          'babel-loader'
        ]
      },
      {
        test: /\.css$/,
        loaders: [
          'style-loader',
          'css-loader'
        ]
      },
      {
        test: /\.scss$/,
        loaders: [
          'style-loader',
          'css-loader',
          'autoprefixer-loader',
          'sass-loader'
        ]
      },
      {
        test: /\.(png|jpg)$/,
        loader: 'file-loader'
      }
    ]
  },
  plugins: [
    new webpack.NoErrorsPlugin()
  ],
  devtool: "source-map"
};
