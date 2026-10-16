// Webpack carga sus loaders CommonJS con require.
// eslint-disable-next-line @typescript-eslint/no-require-imports
const ts = require("typescript");
module.exports = function (source) {
  return ts.transpileModule(source, { compilerOptions: {
    jsx: ts.JsxEmit.ReactJSX, target: ts.ScriptTarget.ES2020, module: ts.ModuleKind.ESNext,
  } }).outputText;
};
