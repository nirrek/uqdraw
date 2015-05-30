// preprocessor.js
var babelJest = require('babel-jest');

module.exports = {
  process: function(src, filename) {
    if (filename.indexOf('css') !== -1) {
      return '';
    } else {
      return babelJest.process(src, filename);
    }
  }
};
