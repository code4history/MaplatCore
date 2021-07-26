/* eslint-disable @typescript-eslint/no-var-requires */
"use strict";

const path = require("path");
const { merge } = require("webpack-merge");
const common = require("./webpack.config.common.js");

module.exports = merge(common, {
  output: {
    path: path.resolve(__dirname, "../dist"),
    filename: './assets/[name].js'
  },

  module: {
    rules: [
      {
        test: /\.(jpg|jpeg|png)$/,
        exclude: /node_modules/,
        loader: 'file-loader',
        options: {
          outputPath: "assets/images",
          publicPath(path) {
            return `assets/images/${path}`;
          }
        }
      }
    ]
  },
});
