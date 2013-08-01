var path = require("path");
var fs = require("fs");

var sassCompiler = module.exports = {};

sassCompiler.getOrderedFileList = function (folder, file, shouldBuild, callback) {
  fs.stat(folder + file, function (err, stats) {
    if (err) return callback(err);
    var cacheToken = stats.mtime.getTime();
    return callback(null, [{ 
      filename: file,
      route: file.replace(".scss", ".css"), 
      version: cacheToken 
    }]);
  });
};

sassCompiler.compile = function (file, shouldBuild, callback) {
  var dir = path.dirname(file);
  var sass = require("node-sass");

  fs.readFile(file, "utf-8", function (err, data) {
    if (err) return callback(err);
    
    sass.render({
      data: data,
      includePaths: [dir], 
      outputStyle: (shouldBuild)? 'compressed': 'nested', 
      success: function (css) {
        return callback(null, css);
      },
      error: callback
    });
  });
};
