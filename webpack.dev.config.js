const path = require('path');

const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

var config = require('./webpack.base.config');

config.devtool = 'source-map';

config.module.loaders.push({
  test: /.scss$/,
  loaders: ['style', 'css?sourceMap', 'sass-loader?sourceMap']
});


config.output.path = path.join(__dirname, 'dev/static/javascripts');
config.output.publicPath = 'http://localhost:8080'

config.plugins = [
  new webpack.HotModuleReplacementPlugin(),
  new HtmlWebpackPlugin({
    template: './client/index.html',
    filename: '../../index.html'
  }),
  new webpack.DefinePlugin({
    'process.env': {
      'NODE_ENV': "'development'"
    }
  })
];

config.entry.app.unshift('webpack-dev-server/client?http://localhost:8080',
  'webpack/hot/dev-server');

config.devServer = {
  hot: true,
  noInfo: true,
  historyApiFallback: true,
  port: 8080,
  publicPath: '/',
  contentBase: './dev',
  inline: true,

  proxy: {
    '/api/*': 'http://localhost:5000',
    '/token': 'http://localhost:5000'
  },

  headers: {
    'Access-Control-Allow-Origin': '*'
  }
}

module.exports = config;
