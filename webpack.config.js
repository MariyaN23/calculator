const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const glob = require('glob-all')

module.exports = {
  entry: {
    yourAwesomeEntryPoint: glob.sync(['./src/*.js']),
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
    }),
  ],
  devServer: {
    static: {
      directory: path.join(__dirname, 'dist'),
    },
    open: true,
  },
  mode: 'development',
}
