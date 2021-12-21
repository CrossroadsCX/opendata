const { resolve } = require('path')
const fs = require('fs')
const PnpPlugin = require('pnp-webpack-plugin')

const files = fs
  .readdirSync("src")
  .filter((item) => item.match(/\.ts$/))
  .map((file) => `./src/${file}`)

const config = {
  entry: files,
  mode: "development",
  devtool: 'inline-source-map',
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: [{
          loader: 'ts-loader',
          options: {
            configFile: "tsconfig.json",
          },
        }],
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js'],
    plugins: [PnpPlugin],
  },
  resolveLoader: {
    plugins: [PnpPlugin.moduleLoader(module)],
  },
  output: {
    filename: 'bundle.js',
    libraryTarget: "commonjs2",
    path: resolve(__dirname),
  },
};

module.exports = config
