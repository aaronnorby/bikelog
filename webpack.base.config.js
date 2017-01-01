const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: {
    app: ['whatwg-fetch', './client/index.jsx']
  },

  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel'
      }
    ]
  },

  resolve: {
    extensions: ['', '.js', '.jsx']
  },

  output: {
    path: path.join(__dirname, './bikelog/static/javascripts'),
    filename: 'bundle.[hash].js'
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: './client/index.html',
      filename: '../../templates/index.html'
    })
  ]
}
