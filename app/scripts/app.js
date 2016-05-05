// Start with your ES5/6/7 script here.
// Import other files or use Browserify require statements.
import './chart';
import './color_generator';
import './notifier';
import './settings';

var activeParams = new Map();

window.ParamsController = {
  activate() {
    activeParams = this.parse();

    if (activeParams.get("stURL") === undefined) {
      this.set("stURL", Settings.getSensorThingsURL());
    }
  },

  encodedParams() {
    var params = [];
    activeParams.forEach(function(value, key) {
      params.push(encodeURIComponent(key) + "=" + encodeURIComponent(value));
    });

    return params.join("&");
  },

  // Retrieve current URL query parameters as a hash
  parse() {
    var params = new Map();

    if (window.location.search === "") { return params; }

    var encodedParams = window.location.search.split('?')[1];
    encodedParams.split('&').forEach(function(pair) {
      var parts = pair.split('=');
      var key = decodeURIComponent(parts[0]),
        value = decodeURIComponent(parts[1]);
      params.set(key, value);
    });

    return params;
  },

  set(key, value) {
    activeParams.set(key, value);
    history.replaceState({}, "", location.pathname + "?" + this.encodedParams());
  }
};
