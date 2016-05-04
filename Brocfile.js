// This is the Brocfile. It sets up all the assets from the input JS/CSS/images
// and so on and converts them to static assets in the output directory or
// preview server.
var _               = require('underscore');
var babel           = require('broccoli-babel-transpiler');
var browserify      = require('broccoli-browserify');
var concat          = require('broccoli-concat');
var compileSass     = require('broccoli-sass');
var funnel          = require('broccoli-funnel');
var gzip            = require('broccoli-gzip');
var jade            = require('broccoli-jade');
var mergeTrees      = require('broccoli-merge-trees');
var templateBuilder = require('broccoli-template-builder');
var uglify          = require('broccoli-uglify-sourcemap');

var sassDir = 'app/styles';
var scripts = 'app/scripts';

// Covert main.scss stylesheet to app.css stylesheet in output directory
var styles = compileSass([sassDir], 'main.scss', 'app.css');

// Process all the JavaScript.
// First we use babel to convert the ES6 to ES5 for web browsers.
scripts = babel(scripts);
// Then use browserify to handle any `require` statements and automatically
// insert the required library inline.
scripts = browserify(scripts, {
  entries: ['./app.js'],
  outputFile: 'app.js'
});

// == Funnel external libraries into individual trees ==
var defaultOptions = {
  include: [
    "**/*.css",
    "**/*.js",
    "**/*.map"
  ]
};

var bootstrap   = funnel('node_modules/bootstrap/dist', defaultOptions);
var fontAwesome = funnel('node_modules/font-awesome', defaultOptions);
var jquery      = funnel('node_modules/jquery/dist', defaultOptions);
var leaflet     = funnel('node_modules/leaflet/dist', defaultOptions);
var q           = funnel('node_modules/q', defaultOptions);
var underscore  = funnel('node_modules/underscore', defaultOptions);
var vendor      = funnel('vendor', defaultOptions);

var libraryTree = mergeTrees([
  bootstrap,
  fontAwesome,
  jquery,
  leaflet,
  q,
  underscore,
  vendor
]);

// == Concatenate script trees ==
// Use inputFiles to specify loading order.

var allScripts = concat(mergeTrees([
  libraryTree,
  scripts
]), {
  inputFiles: [
    'q.js',
    'jquery.js',
    'underscore.js',
    'leaflet-src.js',
    'app.js'
  ],
  outputFile: 'app.js'
});

// Apply uglify to minify the javascript in production.
// (The process is too slow to do this on-the-fly in development.)
if (process.env["NODE_ENV"] === "production") {
  allScripts = uglify(allScripts);
}

// == Concatenate style trees ==
// Use inputFiles to specify loading order.

var allStyles = concat(mergeTrees([
  libraryTree,
  styles
]), {
  inputFiles: [
    'css/bootstrap.css',
    'css/font-awesome.css',
    'leaflet.css',
    'app.css'
  ],
  outputFile: 'style.css',
  sourceMapConfig: {
    enabled: false,
    extensions: ['css'],
    mapCommentType: 'block'
  }
});

// == Funnel external assets into individual trees ==

var faFonts = funnel('node_modules/font-awesome/fonts', {
  destDir: 'fonts'
});

var leafletAssets = funnel('node_modules/leaflet/dist/images', {
  destDir: 'images'
});

var vendorAssets = funnel('vendor/images', {
  destDir: 'images'
});

// This builds all the Javascript Templates (JST) into JS files where the
// templates have been wrapped in functions using underscore's template system.
var templates = templateBuilder('app/templates', {
  extensions: ['jst'],
  outputFile: 'templates.js',
  compile: function(string) {
    return _.template(string, { variable: "obj" }).source;
  }
});

// Compile view files
var views = jade('app/views');

// Build gzipped versions of the files, but only in production.
var doGZIP;
if (process.env["NODE_ENV"] === "production") {
  doGZIP = gzip;
} else {
  doGZIP = function(node) { return node; };
}

module.exports = doGZIP(mergeTrees([views, templates, vendorAssets,
  faFonts,
  leafletAssets,
  allStyles,
  allScripts
]), {
  extensions: ['css', 'html', 'js']
});
