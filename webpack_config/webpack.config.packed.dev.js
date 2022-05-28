/* eslint-disable @typescript-eslint/no-var-requires */
"use strict";

const path = require("path");
const { merge } = require("webpack-merge");
const prod = require("./webpack.config.packed.js");

const port = process.env.PORT || 8888;

module.exports = merge(prod, {
  output: {
    path: path.resolve(__dirname, "../dev_packed"),
    filename: './assets/[name].js'
  },

  devServer: {
    host: "localhost",
    port,
    allowedHosts: "all",
    static: {
      directory: path.resolve(__dirname, '../'),
      watch: true
    },
    hot: true,
    open: {
      target: ["index.html"]
    },
    historyApiFallback: true,
    client: {
      overlay: true
    },
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Pragma": "no-cache",
      "Cache-Control": "no-cache"
    },
    onBeforeSetupMiddleware(devServer) {
      console.log(`Server running at http://localhost:${port}`);
    }
  }
});