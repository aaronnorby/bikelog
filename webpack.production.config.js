const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

var config = require('./webpack.base.config');

config.module.loaders.push({
  test: /.scss$/,
  loader: ExtractTextPlugin.extract('style', 'css!sass')
});

config.plugins.push(new webpack.optimize.DedupePlugin());
config.plugins.push(new webpack.optimize.UglifyJsPlugin());
config.plugins.push(new ExtractTextPlugin('main.[contenthash].css'));

module.exports = config;
