const path = require('path');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')

module.exports = {
  entry: './src/silmaril.ts',
  devtool: 'inline-source-map',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  },
  resolve: { extensions: ['.ts', '.js'] },
  plugins: [
    new UglifyJsPlugin({uglifyOptions: {     
      ecma: 8,      
      output: {
        comments: false,
        beautify: false,        
      },    
      warnings: false
    }
  })],
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname)
  }
};