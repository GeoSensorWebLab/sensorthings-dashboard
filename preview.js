var broccoli = require('broccoli');
var http = require('http');
var express = require('express');
var printSlowNodes = require('broccoli-slow-trees');

var getBuilder = function() {
  var node = broccoli.loadBrocfile();
  return new broccoli.Builder(node);
};

function serve (builder, options) {
  options = options || {};
  var server = {};

  console.log('Previewing on http://' + options.host + ':' + options.port + '\n');

  server.watcher = options.watcher || new broccoli.Watcher(builder, {verbose: true});
  var watcher = broccoli.getMiddleware(server.watcher);

  server.app = express();
  server.app.use(watcher);

  // Use express's Router to catch all routes and handle them by sending the
  // index path to the watcher.
  var router = express.Router();
  router.get('/*', function(req, res) {
    req.url = "/";
    watcher(req, res);
  });
  server.app.use(router);

  server.http = http.createServer(server.app);

  // We register these so the 'exit' handler removing temp dirs is called
  function cleanupAndExit() {
    builder.cleanup().catch(function(err) {
      console.error('Cleanup error:');
      console.error(err && err.stack ? err.stack : err);
    }).finally(function() {
      process.exit(1);
    });
  }

  process.on('SIGINT', cleanupAndExit);
  process.on('SIGTERM', cleanupAndExit);

  server.watcher.on('change', function(results) {
    console.log('Built - ' + Math.round(results.totalTime / 1e6) + ' ms @ ' + new Date().toString());
  });

  server.watcher.on('error', function(err) {
    console.log('Built with error:');
    // Should also show file and line/col if present; see cli.js
    if (err.file) {
      console.log('File: ' + err.file);
    }
    console.log(err.stack);
    console.log('');
  });

  server.http.listen(parseInt(options.port, 10), options.host);
  return server;
}

serve(getBuilder(), {
  port: 4200,
  host: 'localhost'
});
