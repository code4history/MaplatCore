/* eslint-disable @typescript-eslint/no-var-requires */
"use strict";

const path = require("path");
const { merge } = require("webpack-merge");
const prod = require("./webpack.config.standard.js");

const port = process.env.PORT || 8888;

module.exports = merge(prod, {
  output: {
    path: path.resolve(__dirname, "../dev"),
    filename: './assets/[name].js'
  },

  devServer: {
    host: "0.0.0.0",
    public: `localhost:${port}`,
    port,
    openPage: "index.html",
    disableHostCheck: true,
    contentBase: path.resolve(__dirname, '../'),
    watchContentBase: true,
    noInfo: true,
    hot: true,
    open: true,
    historyApiFallback: true,
    overlay: true,
    inline: true,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Pragma": "no-cache",
      "Cache-Control": "no-cache"
    },
    before(_app, _server, _compiler) {
      console.log(`Server running at http://localhost:${port}`);
    }
  }
});