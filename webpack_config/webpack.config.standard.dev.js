/* eslint-disable @typescript-eslint/no-var-requires */
"use strict";

const path = require("path");
const { merge } = require("webpack-merge");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const prod = require("./webpack.config.standard.js");

module.exports = merge(prod, {
  output: {
    path: path.resolve(__dirname, "../dev"),
    filename: '[name].js'
  },

  plugins: [
    new HtmlWebpackPlugin({ template: "./public/index.html" })
  ],
});