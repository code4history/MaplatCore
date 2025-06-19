/* eslint-disable @typescript-eslint/no-var-requires */
"use strict";

const path = require("path");
const { mergeWithRules } = require("webpack-merge");
const common = require("./webpack.config.common.js");
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");

const port = process.env.PORT || 8888;

module.exports = mergeWithRules({
  module: {
    rules: {
      test: "match",
      use: "replace"
    }
  }
})(common, {
  mode: 'development',
  devtool: 'inline-source-map',
  
  entry: {
    "maplat_core": path.resolve(__dirname, "../tmpl/web-bridge-libre.js")
  },
  
  output: {
    path: path.resolve(__dirname, "../dev_packed"),
    filename: './assets/[name].js'
  },
  
  plugins: [
    new ForkTsCheckerWebpackPlugin({
      typescript: {
        configFile: "ts_config/tsconfig.es6.json"
      }
      // Remove eslint configuration
    })
  ],

  module: {
    rules: [
      {
        test: /\.m?js$/,
        resolve: {
          fullySpecified: false
        }
      },
      {
        test: /\.(js|ts)$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
      {
        test: /\.(jpg|jpeg|png)$/,
        exclude: /node_modules/,
        loader: 'url-loader',
      },
      {
        test: /\.less$/,
        exclude: /node_modules/,
        use: [
          { loader: "style-loader" },
          { loader: "css-loader" },
          { loader: "less-loader" }
        ]
      }
    ]
  },

  externals: [
    // Remove mapboxgl external since we're using maplibre
  ],

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