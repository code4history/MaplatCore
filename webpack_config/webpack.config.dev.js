/* eslint-disable @typescript-eslint/no-var-requires */
"use strict";

const path = require("path");
const { merge } = require("webpack-merge");
const standard = require("./webpack.config.standard.js");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = merge(standard, {
  mode: 'development',
  devtool: 'eval',

  entry: {
    "maplat_core": path.resolve(__dirname, "../tmpl/web-bridge.js")
  },

  output: {
    path: path.resolve(__dirname, "../dist"),
    filename: '[name].js',
  },

  plugins: [new HtmlWebpackPlugin({ template: "./public/index.html" })],
});
