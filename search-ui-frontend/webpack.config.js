const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackIncludeAssetsPlugin = require('html-webpack-include-assets-plugin');

// The protocol and port values define how the development server will be started.
const protocol = 'http'; // http or https
const port = 8080; // The port to use (e.g., 8080 for http and 8443 for https...)

// This is the base URI for the webapp and is used when links get created for resources
// such as images and font files. It MUST match the value in the configuration.properties
// file, but with a trailing slash.
const prefix = '/searchui/';

module.exports = {
  // An array of files to run at startup...
  entry: [
    './src/main.js',
    'webpack-dev-server/client?' + protocol + '://' + require('ip').address() + ':' + port,
  ],

  // Tell the server where to serve files from
  output: {
    filename: '[name].js', // Single file that's built
    path: path.resolve(__dirname, 'target/dist'),
    publicPath: prefix,
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  node: {
    fs: "empty"
  },
  module: {
    // The mapping of file patterns to loaders
    rules: [
      {
        // This loader transforms .js and .jsx files using the babel-loader.
        // It uses the es2015, stage-0, and react plug-ins to enable different language features.
        test: /\.jsx?$/,
        include: path.join(__dirname, 'src'),
        loader: 'babel-loader',
        exclude: /node_modules/,
        query: {
          presets: ['env', 'stage-0', 'react'],
        },
      },
      {
        test: /\.(less|css)$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [`css-loader?publicPath=${prefix}`, `less-loader?publicPath=${prefix}`],
        }),
        //loader: 'style-loader!css-loader!autoprefixer-loader!less-loader',
      },
      {
        test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: `url-loader?limit=10000&minetype=application/font-woff&publicPath=${prefix}`,
      },
      {
        test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: `file-loader?publicPath=${prefix}`,
      },
      {
        test: /\.png$/,
        loader: `url-loader?limit=100000&publicPath=${prefix}`,
      },
      {
        test: /\.jpg$/,
        loader: `file-loader?publicPath=${prefix}`,
      },
      {
        test: /\.svg$/,
        loader: `url-loader?limit=10000&mimetype=image/svg+xml&publicPath=${prefix}`,
      },
      {
        test: /\.xml$/,
        loader: 'xml-loader',
        options: {
          trim: true,
          explicitArray: false,
          explicitRoot: false,
        },
      },
    ],
  },
  devtool: 'eval-source-map', // Stuff to do for dev... in this case, generate source maps
  devServer: {
    historyApiFallback: {
      index: '/',
    },
    contentBase: './src',
    host: '0.0.0.0',
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin({
      name: 'common',
    }),
    new FaviconsWebpackPlugin({
      logo: './src/favicon.png',
    }),
    new HtmlWebpackPlugin({
      template: './src/index.template.ejs',
      inject: 'body',
      title: 'Attivio UI',
    }),
    new ExtractTextPlugin('style.css'),
    new CopyWebpackPlugin([
      {
        from: './src/img',
        to: 'img/',
      },
      {
        from: './src/factbook_resources',
        to: 'factbook_resources/',
      },
    ]),
    new HtmlWebpackIncludeAssetsPlugin({
      assets: ['style.css'],
      append: true,
    }),
    // new webpack.DefinePlugin({
    //   'process.env.NODE_ENV': JSON.stringify('production'),
    // }),
  ],
};
