const webpack = require('webpack');
const pjson = require('./package.json');

module.exports = {
  mode: 'production',
  devtool: 'source-map',
  entry: {
    'maplat_core': './tmpl/web-bridge.js'
  },
  output: {
    path: `${__dirname}/dist`,
    filename: '[name].js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules(?!\/@maplat\/tin)/,
        loader: 'babel-loader',
      }
    ]
  },
  plugins: [
    new webpack.BannerPlugin({
      banner: `${pjson.name} v${pjson.version} | ${pjson.author} | license: ${pjson.license}`
    }),
  ],
  externals: [
    { mapboxgl: "mapboxgl" }
  ]
};
