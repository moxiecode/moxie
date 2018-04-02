const path = require('path');

module.exports = {
  entry: './src/ts/moxie/index.ts',
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
    extensions: [ '.ts', '.js' ],
    modules: [ path.resolve(__dirname, "src/ts/moxie"), "node_modules" ]
  },
  output: {
    filename: 'moxie.js',
    path: path.resolve(__dirname, 'dist')
  }
};