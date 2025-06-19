/* eslint-disable @typescript-eslint/no-var-requires */
"use strict";

const path = require("path");
const { BannerPlugin } = require("webpack");
const pjson = require("../package.json");
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");

const port = process.env.PORT || 8888;

module.exports = {
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
    new BannerPlugin({
      banner: `${pjson.name} v${pjson.version} | ${pjson.author} | license: ${pjson.license}`
    }),
    new ForkTsCheckerWebpackPlugin({
      typescript: {
        configFile: "ts_config/tsconfig.es6.json"
      }
    })
  ],

  resolve: {
    extensions: [".js", ".ts"],
  },

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
        loader: 'ts-loader',
        options: {
          configFile: "ts_config/tsconfig.es6.json",
          transpileOnly: true,
          allowTsInNodeModules: true
        }
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

  target: "web",

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
      target: ["test_maplibre.html"]
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
    setupMiddlewares: (middlewares, devServer) => {
      console.log(`Server running at http://localhost:${port}`);
      return middlewares;
    }
  }
};