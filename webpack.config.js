const path = require('path');

module.exports = {
  entry: './src/ts/index.ts',
  //devtool: 'cheap-module-eval-source-map',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: [ '.ts', '.js' ]
  },
  output: {
    filename: 'moxie.js',
    path: path.resolve(__dirname, 'dist')
  }
};