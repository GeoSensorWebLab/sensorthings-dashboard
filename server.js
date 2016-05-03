var broccoli            = require('broccoli');
var copyDereferenceSync = require('copy-dereference').sync;
var express             = require('express');
var fs                  = require('fs');
var gzipStatic          = require('connect-gzip-static');
var http                = require('http');
var path                = require('path');
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

// Start up server
function serve() {
  var app = express();
  var router = express.Router();
  router.get('/*', function(req, res, next) {
    // Check for resource requests and redirect to the index file for them
    if (path.extname(req.path).length > 0) {
      next();
    } else {
      req.url = "/index.html";
      next();
    }
  });
  app.use(router);
  app.use(gzipStatic(__dirname + "/public", {
    maxAge: 31536000 * 1000 // 1 year
  }));

  var server = app.listen(process.env.PORT || 5000, function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log('Example app listening at http://%s:%s', host, port);
  });
}
Q(clean("public"))
.then(function() {
  return build("public");
})
.then(serve)
.done();
