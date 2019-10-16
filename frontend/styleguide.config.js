const path = require('path');
const webpackConfig = require('./webpack.config');

module.exports = {
  title: 'Attivio Search UI Component Reference',
  verbose: true,
  assetsDir: 'docs/static',
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
    return `import ${name} from '../components/${name}.js';`;
  },
  getExampleFilename(componentPath) {
    const name = path.basename(componentPath, '.js');
    const mdName = `${name}.md`;
    const dir = path.dirname(componentPath);
    const fullMdPath = path.resolve(dir, '../../docs/components', mdName);
    return fullMdPath;
  },
  webpackConfig: webpackConfig,
};
