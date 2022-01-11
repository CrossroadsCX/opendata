const { resolve } = require('path')
const fs = require('fs')
const PnpPlugin = require('pnp-webpack-plugin')

const fileMap = {};
const files = fs
  .readdirSync("src")
  .filter((item) => item.match(/^[a-zA-Z]+(?!\.d)\.ts$/))
  .map((file) => {
    fileMap[file.replace('.ts', '')] = resolve(`./src/${file}`);
  })

const config = {
  entry: fileMap,
  target: 'node',
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
    filename: '[name]/function.js',
    libraryTarget: "commonjs",
    path: resolve(__dirname, 'dist'),
  },
};

module.exports = config
