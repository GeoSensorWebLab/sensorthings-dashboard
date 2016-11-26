var broccoli            = require('broccoli');
var copyDereferenceSync = require('copy-dereference').sync;
var fs                  = require('fs');
var Q                   = require('q');
var rimraf              = require('rimraf');

// Clean existing data
function clean(directory) {
  if (fs.existsSync(directory)) {
    rimraf.sync(directory);
  }
}

// Build application
function build(output) {
  var node = broccoli.loadBrocfile();
  var builder = new broccoli.Builder(node);
  return builder.build()
    .then(function (hash) {
      var dir = hash.directory;
      copyDereferenceSync(dir, output);
    })
    .finally(function () {
      return builder.cleanup();
    });
}

Q(clean("public"))
.then(function() {
  return build("public");
})
.done();
