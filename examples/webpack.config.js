/**
 * devServer的memory files在路径 /webpack-dev-server 下
 */

const path = require('path');
const HTMLPlugin = require('html-webpack-plugin');
const webpackMerge = require('webpack-merge');
const getWebpackConfig = require('bubai/lib/getWebpackConfig');

const webpackConfig = getWebpackConfig(false, 'react-hot-loader/babel');

const config = {
  mode: 'development',
  devtool: '#cheap-module-eval-source-map',
  entry: {
    app: path.join(__dirname, './index.tsx'),
  },
  // output: {
  //   path: path.join(__dirname, '__build__'),
  //   filename: 'bundle.js', // production 中chunkhash化即可
  // },
  devServer: {
    host: '127.0.0.1',
    port: '9999',
    hot: true,
    overlay: {
      errors: true,
    },
    historyApiFallback: {
      index: '/index.html',
    },
  },
  resolve: {
    mainFiles: ['index', 'demo'],
    alias: {
      '@components': path.resolve(__dirname, '../components'),
      'react-dom': '@hot-loader/react-dom',
    },
  },
  module: {
    rules: [
      {
        enforce: 'pre',
        test: /\.tsx?$/,
        use: {
          loader: 'tslint-loader',
          options: {
            fix: true,
          },
        },
        exclude: [
          path.resolve(__dirname, '../node_modules'),
        ],
      },
    ],
  },
  plugins: [
    new HTMLPlugin({
      template: path.join(__dirname, './template.html'),
    }),
  ],
};
module.exports = webpackMerge({}, webpackConfig, config);
