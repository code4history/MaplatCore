/* eslint-disable @typescript-eslint/no-var-requires */
"use strict";

const path = require("path");
const { BannerPlugin } = require("webpack");
const pjson = require("../package.json");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const TerserPlugin = require("terser-webpack-plugin");

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
    new HtmlWebpackPlugin({
      template: "./public/index.html"
    }),
    new ForkTsCheckerWebpackPlugin({
      eslint: {
        files: "./{src,spec}/**/*.{js,ts}"
      },
      typescript: {
        configFile: "ts_config/tsconfig.es6.json"
      }
    }),
    new MiniCssExtractPlugin({
      filename: "./assets/[name].css"
    })
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
        test: /\.m?js$/,
        resolve: {
          fullySpecified: false
        }
      },
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
};
