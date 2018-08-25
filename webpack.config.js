const path = require('path');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const devMode = !!process.env.WEBPACK_SERVE;

module.exports = {
  mode: devMode ? 'development' : 'production',
  entry: './src/main.js',
  output: {
    path: path.resolve(__dirname, 'docs'),
    filename: 'bundle.js',
    chunkFilename: '[name].js',
  },
  module: {
    rules: [
      {
        test: /\.sass$/,
        use: [
          devMode ? 'vue-style-loader' : MiniCssExtractPlugin.loader,
          'css-loader?minimize',
          'sass-loader?indentedSyntax',
        ],
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader',
      }
    ],
  },
  devtool: devMode ? 'cheap-eval-source-map' : 'none',
  resolve: {
    alias: {
      'vue$': 'vue/dist/vue.esm.js',
      'src': path.resolve(__dirname, 'src'), // allows you to reference src directly from anywhere (e.g. import {} from 'src/js/file')
      'common': path.resolve(__dirname, 'src/components/common'), // easy access to common components
    }
  },
  plugins: [
    new VueLoaderPlugin(),
    new CopyWebpackPlugin([
      './src/index.html',
      { from: './src/images/', to: 'images/' },
    ]),
    new MiniCssExtractPlugin({
      filename: 'style.css',
      chunkFilename: '[name].css',
    }),
  ],
};
