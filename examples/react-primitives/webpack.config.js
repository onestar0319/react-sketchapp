const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: {
    main: './src/main.js',
  },

  output: {
    filename: '[name].js',
    library: 'onRun',
    path: path.join(__dirname, 'react-primitives.sketchplugin/Contents/Sketch'),
  },

  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
    ],
  },

  plugins: [new CopyWebpackPlugin([{ from: 'src/manifest.json' }])],

  resolve: {
    extensions: ['.sketch.js', '.js'],
  },
};
