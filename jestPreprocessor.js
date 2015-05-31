// preprocessor.js
var babelJest = require('babel-jest');
var path = require('path');

module.exports = {
  process: function(src, filename) {
    var isProjectFile = false;
    var isJsx = false;
    var isJs = false;

    if (filename.indexOf(path.resolve('js')) === 0) {
        isProjectFile = true;
    }

    if (filename.match(/\.jsx$/)) {
        isJsx = true;
    }

    if (filename.match(/\.js$/)) {
        isJs = true;
    }

    // Project js and jsx files
    if (isProjectFile && (isJsx || isJs)) {
        return babelJest.process(src, filename);
    }

    // Non-project js files (e.g. node_modules js files)
    else if (!isProjectFile && isJs) {
        return src;
    }

    // All other files return nothing (e.g. required sass files)
    else {
        return;
    }
  }
};
