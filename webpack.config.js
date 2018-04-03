const fs = require('fs');
const path = require('path');

const webpack = require('webpack');
const DeclarationBundlerWebpackPlugin = require('declaration-bundler-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const UglifyJsWebpackPlugin = require('uglifyjs-webpack-plugin');

const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = relativePath => path.resolve(appDirectory, relativePath);

const namespace = 'moxie';

const pathToBuild = resolveApp('bin/js'); // for compatibility reasons
const pathToPackageJson = resolveApp('package.json');
const pathToSrc = resolveApp('src');
const pathToNodeModules = resolveApp('node_modules');
const pathToTsConfig = resolveApp('tsconfig.json');
const pathToTsLint = resolveApp('tslint.json');

const package = require(pathToPackageJson);

const shouldUseSourceMap = true;

module.exports = {
  bail: true,
  mode: 'production',
  entry: {
    [namespace]: './src/index.ts'
  },
  devtool: shouldUseSourceMap ? 'source-map' : false,
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        loader: require.resolve('source-map-loader'),
        enforce: 'pre',
        include: pathToSrc,
      },
      {
        test: /\.(ts|tsx)$/,
        include: pathToSrc,
        use: [
          {
            loader: require.resolve('ts-loader'),
            options: {
              // disable type checker - we will use it in fork plugin
              transpileOnly: true,
            },
          },
        ]
      }
    ]
  },
  resolve: {
    modules: [ pathToSrc, pathToNodeModules ],
    extensions: [ '.ts', '.js' ]
  },
  optimization: {
    minimize: true
  },
  plugins: [
    new webpack.BannerPlugin({
      banner: `
${package.name} - ${package.description}
v${package.version}

Copyright ${new Date().getFullYear()}, ${package.author}
Released under AGPLv3 License.

License: http://www.plupload.com/license
Contributing: http://www.plupload.com/contributing

Date: ${package.releaseDate}
`,
      //entryOnly: true,
      raw: false,
    }),
    // new DeclarationBundlerWebpackPlugin({
    //   moduleName: namespace,
    //   out: `${pathToBuild}/${namespace}.d.ts`,
    // }),
    new ForkTsCheckerWebpackPlugin({
      async: false,
      tsconfig: pathToTsConfig,
      tslint: pathToTsLint,
    }),

  ],
  output: {
    path: pathToBuild,
    filename: '[name].min.js', // apply .min suffix for compatibility reasons (that's what users of previous versions would expect)
    library: namespace,
    libraryExport: 'default',
    libraryTarget: 'umd',
    // Point sourcemap entries to original disk location (format as URL on Windows)
    devtoolModuleFilenameTemplate: info =>
      path
        .relative(pathToSrc, info.absoluteResourcePath)
        .replace(/\\/g, '/'),
  }
};