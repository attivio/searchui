const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin'); // eslint-disable-line import/no-extraneous-dependencies
const merge = require('webpack-merge'); // eslint-disable-line import/no-extraneous-dependencies
const appWebpackConfig = require('./webpack.config');
// const MiniHtmlWebpackPlugin = require('mini-html-webpack-plugin');

// const config = {
//   plugins: [
//     new MiniHtmlWebpackPlugin({
//       context: {
//         title: 'Webpack demo'
//       },
//       filename: 'demo.html' // Optional, defaults to `index.html`
//     })
//   ]
// };

const ourWebpackConfig = {
  node: {
    fs: 'empty',
  },
  // module: {
  //   rules: [
  //     {
  //       test: /\.less$/,
  //       use: ExtractTextPlugin.extract({
  //         fallback: 'style-loader',
  //         use: ['css-loader', 'less-loader'],
  //       }),
  //     },
  //     {
  //       test: /\.css$/,
  //       use: ExtractTextPlugin.extract({
  //         fallback: 'style-loader',
  //         use: ['css-loader'],
  //       }),
  //     },

  //   ],
  // },
};

const mergedWebpackConfig = merge(appWebpackConfig, ourWebpackConfig);

module.exports = {
  title: 'Attivio Search UI Component Reference',
  verbose: true,
  assetsDir: 'docs/static',
  // template: () => {
  //   return `<!DOCTYPE html>
  //     <html>
  //       <head>
  //         <meta http-equiv="Content-type" content="text/html; charset=utf-8" />
  //         <meta charset="utf-8" />
  //         <meta name="viewport" content="width=device-width, initial-scale=1.0">
  //         <link href='https://api.tiles.mapbox.com/mapbox-gl-js/v0.37.0/mapbox-gl.css' rel='stylesheet' />
  //       </head>
  //       <body>
  //         <div id='app'></div>
  //       </body>
  //     </html>
  //   `;
  // },
  ignore: [], // Add any componets we want to exclude here
  defaultExample: false,
  usageMode: 'expand',
  styleguideDir: 'target/styleguide',
  editorConfig: {
    theme: 'ambiance', // see http://codemirror.net/demo/theme.html
  },
  styles: {},

  sections: [
    {
      name: 'Components',
      components: () => {
        return [
          'src/components/DummyComp.js',
        ];
      },
    },
  ],
  require: [
    path.join(__dirname, 'src/style/main.less'),
  ],
  getComponentPathLine(componentPath) {
    const name = path.basename(componentPath, '.js');
    // const dir = path.dirname(componentPath);
    return `import ${name} from '../components/${name}.js';`;
  },
  getExampleFilename(componentPath) {
    const name = path.basename(componentPath, '.js');
    const mdName = `${name}.md`;
    const dir = path.dirname(componentPath);
    const fullMdPath = path.resolve(dir, '../../docs/components', mdName);
    return fullMdPath;
  },
  webpackConfig: mergedWebpackConfig,
};
