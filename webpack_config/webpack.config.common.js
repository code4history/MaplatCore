/* eslint-disable @typescript-eslint/no-var-requires */
"use strict";

const path = require("path");
const { BannerPlugin } = require("webpack");
const pjson = require("../package.json");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const TerserPlugin = require("terser-webpack-plugin");

const port = process.env.PORT || 8888;

module.exports = {
  mode: 'production',
  devtool: 'source-map',

  entry: {
    "maplat_core": path.resolve(__dirname, "../tmpl/web-bridge.js")
  },

  plugins: [
    new BannerPlugin({
      banner: `${pjson.name} v${pjson.version} | ${pjson.author} | license: ${pjson.license}`
    }),
    new CleanWebpackPlugin(),
    new ForkTsCheckerWebpackPlugin({
      eslint: {
        files: "./{src,spec}/**/*.{js,ts}"
      }
    }),
    new MiniCssExtractPlugin()
  ],

  externals: [
    { mapboxgl: "mapboxgl" }
  ],


  resolve: {
    extensions: [".js", ".ts"],
  },

  module: {
    rules: [
      {
        enforce: "pre",
        test: /\.(js|ts)?$/,
        exclude: /node_modules/,
        loader: "eslint-loader",
        options: {
          cache: true
        }
      },
      {
        test: /\.(js|ts)$/,
        exclude: /node_modules(?![/\\](@maplat[/\\]tin|weiwudi))/,
        loader: 'babel-loader',
      },
      {
        test: /\.less$/,
        exclude: /node_modules/,
        use: [
          MiniCssExtractPlugin.loader,
          { loader: "css-loader" },
          { loader: "less-loader" }
        ]
      },
    ]
  },

  target: "web",

  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin(),
      new CssMinimizerPlugin(),
    ],
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
};
