import CopyPlugin from 'copy-webpack-plugin';
import ExampleBuilder from './example-builder.js';
import TerserPlugin from 'terser-webpack-plugin';
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import fs from 'fs';
import path, {dirname} from 'path';
import {fileURLToPath} from 'url';

const src = path.join(dirname(fileURLToPath(import.meta.url)), '..');
const root = path.join(src, '..');

export default {
  context: src,
  target: ['browserslist'],
  entry: () => {
    const entry = {};
    fs.readdirSync(src)
      .filter(name => /^(?!index).*\.html$/.test(name))
      .map(name => name.replace(/\.html$/, ''))
      .forEach(example => {
        entry[example] = `./${example}.js`;
      });
    return entry;
  },
  stats: 'minimal',
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: "babel-loader",
        include: [path.join(root, "src", "ol", "worker")]
      },
      {
        test: /\.ts$/,
        use: {
          loader: "ts-loader",
          options: {
            transpileOnly: true,
            configFile: path.join(root, "ts_config", "tsconfig.es6.json")
          }
        },
        exclude: /node_modules/
      },
      {
        test: /\.(jpg|jpeg|png)$/,
        use: {
          loader: 'file-loader',
          options: {
            outputPath: "assets/images",
            publicPath(path) {
              return `assets/images/${path}`;
            }
          }          
        },
        exclude: /node_modules/,
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
    ],
  },
  optimization: {
    minimizer: [
      new TerserPlugin({
        // Do not minify examples that inject code into workers
        exclude: [/(color-manipulation|region-growing|raster)\.js/],
        extractComments: false,
      }),
    ],
    runtimeChunk: {
      name: 'common',
    },
    splitChunks: {
      name: 'common',
      chunks: 'initial',
      minChunks: 2,
    },
  },
  plugins: [
    new ExampleBuilder({
      templates: path.join(src, 'templates'),
      common: 'common',
    }),
    new CopyPlugin({
      patterns: [
        {
          from: path.join(root, 'site', 'src', 'theme'),
          to: 'theme',
        },
        {
          from: path.join(root, 'src', 'ol', 'ol.css'),
          to: path.join('theme', 'ol.css'),
        },
        {from: 'data', to: 'data'},
        {from: '../apps', to: 'apps'},
        {from: '../maps', to: 'maps'},
        {from: '../pois', to: 'pois'},
        {from: '../tiles', to: 'tiles'},
        {from: '../parts', to: 'parts'},
        {from: 'resources', to: 'resources'},
        {from: 'index.html', to: 'index.html'},
        {from: 'index.js', to: 'index.js'},
      ],
    }),
    new ForkTsCheckerWebpackPlugin({
      //eslint: {
      //  files: "./{src,spec}/**/*.{js,ts}"
      //},
      typescript: {
        configFile: "../ts_config/tsconfig.es6.json"
      }
    }),
    new MiniCssExtractPlugin({
      filename: "./assets/[name].css"
    }),
  ],
  devtool: 'source-map',
  output: {
    filename: '[name].js',
    path: path.join(root, 'docs'),
  },
  resolve: {
    fallback: {
      fs: false,
      http: false,
      https: false,
    },
    extensions: [".js", ".ts"],
    /*alias: {
      // allow imports from 'ol/module' instead of specifiying the source path
      ol: path.join(root, 'src', 'ol'),
    },*/
  },
};