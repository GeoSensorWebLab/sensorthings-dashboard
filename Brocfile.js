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
var helper          = require('./helpers/broccoli');
var jade            = require('broccoli-jade');
var mergeTrees      = require('broccoli-merge-trees');
var templateBuilder = require('broccoli-template-builder');
var uglify          = require('broccoli-uglify-sourcemap');

// Covert main.scss stylesheet to app.css stylesheet in output directory
var styles = compileSass(['app/styles'], 'main.scss', 'app.css');

// Process all the JavaScript.
// First we use babel to convert the ES6 to ES5 for web browsers.
// Then use browserify to handle any `require` statements and automatically
// insert the required library inline.
var scripts = babel("app/scripts");
scripts = browserify(scripts, {
  entries: ['./app.js'],
  outputFile: 'app.js'
});

// == Load External Libraries ==
// Order is important. Scripts will be concatenated in this order, and
// styles will be concatenated in this order (into separate JS and CSS files
// obviously).
// Assets will be funnelled into a single tree with the same name
// as the source asset directory. (e.g. 'img' directory will create 'img'
// directory in output.)
helper.loadLibrary('node_modules/jquery/dist', {
  scripts: ['jquery.js'],
  styles: [],
  assets: []
});

helper.loadLibrary('node_modules/tether/dist', {
  scripts: ['js/tether.js'],
  styles: ['css/tether.css'],
  assets: []
});

helper.loadLibrary('node_modules/bootstrap/dist', {
  scripts: ['js/bootstrap.js'],
  styles: ['css/bootstrap.css'],
  assets: ['']
});

helper.loadLibrary('node_modules/d3', {
  scripts: ['d3.js'],
  styles: [],
  assets: []
});

helper.loadLibrary('node_modules/font-awesome', {
  scripts: [],
  styles: ['css/font-awesome.css'],
  assets: ['fonts']
});

helper.loadLibrary('node_modules/leaflet/dist', {
  scripts: ['leaflet-src.js'],
  styles: ['leaflet.css'],
  assets: ['images']
});

helper.loadLibrary('node_modules/nvd3/build', {
  scripts: ['nv.d3.js'],
  styles: ['nv.d3.css'],
  assets: []
});

helper.loadLibrary('node_modules/q', {
  scripts: ['q.js'],
  styles: [],
  assets: []
});

helper.loadLibrary('node_modules/underscore', {
  scripts: ['underscore.js'],
  styles: [],
  assets: []
});

helper.loadLibrary('node_modules/pluralize', {
  scripts: ['pluralize.js'],
  styles: [],
  assets: []
});

helper.loadLibrary('vendor', {
  scripts: [],
  styles: [],
  assets: ['images']
});

// == Concatenate script trees ==
// Merge the libraries tree with the app scripts tree, then concatenate into
// a single script file.
var allScripts = concat(mergeTrees([helper.getScriptsTree(), scripts]), {
  inputFiles: ['libraries.js', 'app.js'],
  outputFile: 'app.js'
});

// Apply uglify to minify the javascript in production.
// (The process is too slow to do this on-the-fly in development.)
if (process.env["NODE_ENV"] === "production") {
  allScripts = uglify(allScripts);
}

// == Concatenate style trees ==
var allStyles = concat(mergeTrees([helper.getStylesTree(), styles]), {
  inputFiles: ['libraries.css', 'app.css'],
  outputFile: 'style.css',
  sourceMapConfig: {
    enabled: false,
    extensions: ['css'],
    mapCommentType: 'block'
  }
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

module.exports = doGZIP(mergeTrees([views, templates,
  helper.getAssetsTree(),
  allStyles,
  allScripts
]), {
  extensions: ['css', 'html', 'js']
});
