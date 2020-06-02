const path = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin')
const htmlPlugin = new HtmlWebpackPlugin({
    template: './src/index.html',
    filename: 'index.html'
})
module.exports = {
  entry: {
    index: ['babel-polyfill', './src/index.js']
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  devServer:{
    contentBase: 'dist'
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      },
      {
        test: /\.css$/i,
        use: [
          'style-loader',
          { loader: 'css-loader', options: { importLoaders: 2} },
          'postcss-loader',
          'sass-loader'
        ],
      },
      {
        test: /\.less$/,
        loader: 'less-loader', // compiles Less to CSS
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          // Creates `style` nodes from JS strings
          'style-loader',
          // Translates CSS into CommonJS
          { loader: 'css-loader', options: { importLoaders: 2, modules: { localIdentName: '[path][name]__[local]--[hash:base64:5]' } } },
          // Compiles Sass to CSS
          'sass-loader',
          { loader: 'sass-resources-loader',
            options: {
              resources: path.resolve(__dirname, 'src/static/common.scss')
            }
          }
        ],
      },
      {
        test: /\.(png|jpg|gif|eot|ttf|woff|svg)$/i,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 8192,
            },
          },
        ],
      },
    ]
  },
  resolve: {
    extensions: [
      '.jsx', '.js',
      '.web.js', '.web.jsx',
      '.json',
    ],
    alias: {
      // 添加目录便于引用
      '@components': path.resolve(__dirname, 'src/components'),
      '@hooks': path.resolve(__dirname, 'src/hooks')
    },
  },
  plugins: [htmlPlugin],
};