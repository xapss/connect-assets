var path = require("path");
var fs = require("fs");

var stylusCompiler = module.exports = {};

stylusCompiler.getOrderedFileList = function (folder, file, shouldBuild, callback) {
  fs.stat(folder + file, function (err, stats) {
    if (err) return callback(err);
    var cacheToken = stats.mtime.getTime();
    return callback(null, [{
      filename: file,
      route: file.replace(".styl", ".css"),
      version: cacheToken
    }]);
  });
};

stylusCompiler.compile = function (file, shouldBuild, callback) {
  var dir = path.dirname(file);
  var stylus = require("stylus");

  fs.readFile(file, "utf-8", function (err, data) {
    if (err) return callback(err);

    stylus.render(data, {
      filename: file,
      paths: [dir],
      compress: shouldBuild
    }, function (err, css) {
      if (err) return callback(err);
      return callback(null, css);
    });
  });
};
