/* eslint-disable @typescript-eslint/no-var-requires */
"use strict";

const path = require("path");
const port = process.env.PORT || 8888;

module.exports = {
  entry: {
    "dummy": path.resolve(__dirname, "../public/dummy.js")
  },

  devServer: {
    host: "0.0.0.0",
    public: `localhost:${port}`,
    port,
    disableHostCheck: true,
    contentBase: path.resolve(__dirname, '../'),
    watchContentBase: false,
    noInfo: true,
    hot: true,
    open: false,
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
};