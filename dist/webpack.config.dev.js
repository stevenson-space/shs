"use strict";

var path = require('path');

var VueLoaderPlugin = require('vue-loader/lib/plugin');

var TerserPlugin = require('terser-webpack-plugin');

var CopyWebpackPlugin = require('copy-webpack-plugin');

var MiniCssExtractPlugin = require('mini-css-extract-plugin');

var _require = require('webpack-bundle-analyzer'),
    BundleAnalyzerPlugin = _require.BundleAnalyzerPlugin;

var Dotenv = require('dotenv-webpack');

var devMode = !!process.env.WEBPACK_SERVE;

module.exports = function (env) {
  var options = {
    mode: devMode ? 'development' : 'production',
    entry: './src/main.js',
    output: {
      path: path.resolve(__dirname, 'docs'),
      publicPath: '/',
      filename: 'build.js',
      chunkFilename: '[name].js'
    },
    module: {
      rules: [{
        test: /\.sass$/,
        use: [devMode ? 'vue-style-loader' : MiniCssExtractPlugin.loader, 'css-loader?minimize', 'sass-loader?indentedSyntax']
      }, {
        test: /\.vue$/,
        loader: 'vue-loader'
      }, {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      }]
    },
    devtool: devMode ? 'cheap-eval-source-map' : 'none',
    resolve: {
      alias: {
        vue$: 'vue/dist/vue.esm.js',
        src: path.resolve(__dirname, 'src'),
        // allows you to reference src directly from anywhere (e.g. import {} from 'src/js/file')
        common: path.resolve(__dirname, 'src/components/common') // easy access to common components

      }
    },
    optimization: {
      minimizer: [new TerserPlugin({
        terserOptions: {
          safari10: true,
          compress: {
            drop_console: true
          }
        }
      })]
    },
    plugins: [new VueLoaderPlugin(), new CopyWebpackPlugin(['./src/index.html', './src/favicon/favicon.ico', {
      from: './src/static/',
      to: 'static/'
    }, {
      from: './src/favicon',
      to: 'favicon/'
    }, './src/service-worker.js']), new MiniCssExtractPlugin({
      filename: 'style.css',
      chunkFilename: '[name].css'
    }), new Dotenv({
      path: './.env'
    })]
  };

  if (env && env.analyze) {
    options.plugins.push(new BundleAnalyzerPlugin());
  }

  return options;
};