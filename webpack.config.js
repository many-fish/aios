var PackCSS = require('extract-text-webpack-plugin');

module.exports = {
  entry: {
    home: './src/entry/home',
    recycle: './src/entry/recycle',
    personal: './src/entry/personal'
  },
  output: {
    path: __dirname + '/dist/contents/js',
    filename: '[name].min.js'
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: PackCSS.extract({
          use: 'css-loader!postcss-loader'
        })
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        options: {
          cacheDirectory: true
        }
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          css: 'css-loader!postcss-loader',
          html: 'html-loader'
        }
      },
      {
        test: /\.(svg|png)$/,
        loader: 'url-loader?limit=4096'
      }
    ]
  },
  plugins: [
    new PackCSS('../css/[name].min.css')
  ],
  resolve: {
    extensions: ['.css','.js','.json','.vue']
  },
  externals: {
    vue: 'Vue'
  }
}