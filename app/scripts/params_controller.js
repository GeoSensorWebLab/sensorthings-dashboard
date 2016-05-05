// Parse query parameters in the URL
// Adds values from localStorage if they are missing in the query parameters.
class ParamsController {
  constructor(options) {
    this.activeParams = new Map();
    this.settings = options.settings;
  }

  activate() {
    this.activeParams = this.parse();

    if (this.activeParams.get("stURL") === undefined) {
      this.set("stURL", this.settings.getSensorThingsURL());
    }
  }

  encodedParams() {
    var params = [];
    this.activeParams.forEach(function(value, key) {
      params.push(encodeURIComponent(key) + "=" + encodeURIComponent(value));
    });

    return params.join("&");
  }

  get(key) {
    return this.activeParams.get(key);
  }

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
  }

  set(key, value) {
    this.activeParams.set(key, value);
    history.replaceState({}, "", location.pathname + "?" + this.encodedParams());
  }
}

export default ParamsController;
