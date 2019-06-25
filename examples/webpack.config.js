const path = require('path');
const webpack = require('webpack');
const HTMLPlugin = require('html-webpack-plugin');

const config = {
  entry: {
    app: path.join(__dirname, './index.tsx'),
  },
  output: {
    path: path.join(__dirname, '../dist'),
    filename: 'bundle.js', // production 中chunkhash化即可
  },
  resolve: {
    mainFiles: ['index', 'demo'],
    extensions: ['.tsx', '.ts', '.js', '.json'],
    alias: {
      '@components': path.resolve(__dirname, '../src'),
      'react-dom': '@hot-loader/react-dom',
    },
  },
  module: {
    rules: [
      {
        enforce: 'pre',
        test: /.tsx?$/,
        use: {
          loader: 'tslint-loader',
          // options: {
          //   fix: true,
          // },
        },
        exclude: [
          path.resolve(__dirname, '../node_modules'),
        ],
      },
      {
        enforce: 'pre',
        test: /\.js$/,
        loader: 'source-map-loader',
      },
      {
        test: /\.tsx?$/,
        use: {
          loader: 'awesome-typescript-loader', // 按需加载需引入ts-import-plugin
          options: {
            // cacheDirectory: true, // 开启loader缓存, 会偶现error info --- The "path" argument must be of type string. Received type boolean
            transpileOnly: true,
            // useCache: true,
            babelOptions: {
              babelrc: false,
              plugins: [
                'react-hot-loader/babel',
              ],
            },
          },
        },
      },
      {
        test: /\.less$/, // 生产环境要extract-text插件抽包
        use: [{
          loader: 'style-loader', // creates style nodes from JS strings
        }, {
          loader: 'css-loader', // translates CSS into CommonJS
        }, {
          loader: 'less-loader', // compiles Less to CSS
        }],
      },
      {
        test: /\.css$/,
        use: [
          'style-loader', 'css-loader',
        ],
      },
      {
        test: /\.(png|jpg|gif|svg)$/, // url-loader所有配置不符合limit时自动降级file-loader
        use: {
          loader: 'url-loader',
          options: {
            limit: 8192,
            name: '[name].[ext]?[hash]',
          },
        },
      },
    ],
  },
  plugins: [
    new HTMLPlugin({
      template: path.join(__dirname, './template.html'),
    }),
  ],
};
module.exports = (env, argv) => {
  if (argv.mode === 'development') {
    config.mode = 'development';
    config.devtool = '#cheap-module-eval-source-map';
    config.devServer = {
      host: '0.0.0.0',
      port: '9999',
      hot: true,
      overlay: {
        errors: true,
      },
      historyApiFallback: {
        index: '/index.html',
      },
    };
    config.plugins.push(
      new webpack.HotModuleReplacementPlugin(),
      new webpack.NoEmitOnErrorsPlugin()
    );
  }

  if (argv.mode === 'production') {
    config.mode = 'production';
    config.devtool = 'source-map';
  }
  return config;
};
