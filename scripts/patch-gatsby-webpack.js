const fs = require('fs');
const path = require('path');

const webpackUtilsPath = path.join(
  __dirname,
  '..',
  'node_modules',
  'gatsby',
  'dist',
  'utils',
  'webpack-utils.js',
);
const webpackConfigPath = path.join(
  __dirname,
  '..',
  'node_modules',
  'gatsby',
  'dist',
  'utils',
  'webpack.config.js',
);

const oldCode = 'plugins.moment = () => plugins.ignore(/^\\.\\/locale$/, /moment$/);';
const newCode =
  'plugins.moment = () => plugins.ignore({ resourceRegExp: /^\\.\\/locale$/, contextRegExp: /moment$/ });';
const fastRefreshOld =
  'configPlugins = configPlugins.concat([plugins.fastRefresh({\n            modulesThatUseGatsby\n          }), new _forceCssHmrForEdgeCases.ForceCssHMRForEdgeCases(), plugins.hotModuleReplacement(), plugins.noEmitOnErrors(), plugins.eslintGraphqlSchemaReload(), new _staticQueryMapper.StaticQueryMapper(store)]).filter(Boolean);';
const fastRefreshNew =
  'configPlugins = configPlugins.concat([new _forceCssHmrForEdgeCases.ForceCssHMRForEdgeCases(), plugins.hotModuleReplacement(), plugins.noEmitOnErrors(), plugins.eslintGraphqlSchemaReload(), new _staticQueryMapper.StaticQueryMapper(store)]).filter(Boolean);';

if (!fs.existsSync(webpackUtilsPath)) {
  process.exit(0);
}

const patchFile = (filePath, from, to) => {
  if (!fs.existsSync(filePath)) {
    return;
  }

  const contents = fs.readFileSync(filePath, 'utf8');

  if (contents.includes(to)) {
    return;
  }

  if (!contents.includes(from)) {
    throw new Error(`Unable to find patch target in ${path.basename(filePath)}.`);
  }

  fs.writeFileSync(filePath, contents.replace(from, to));
};

patchFile(webpackUtilsPath, oldCode, newCode);

if (fs.existsSync(webpackConfigPath)) {
  patchFile(webpackConfigPath, fastRefreshOld, fastRefreshNew);
}
