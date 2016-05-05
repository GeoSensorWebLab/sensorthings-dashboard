import Thing from './models/thing';

var $ = require('jquery');

class SensorThings {
  constructor(url) {
    this.baseURL = url;
    this.defaultAjaxOptions = {
      dataType: "json",
      type: "GET"
    };
    this.links = undefined;
  }

  getLinks() {
    if (this.links !== undefined) {
      return this.links;
    } else {
      return this.getRoot()
      .then((response) => {
        var links = {};
        response.value.forEach((link) => { links[link.name] = link.url; });
        this.links = links;
        return links;
      });
    }
  }

  // * Request Handling * //

  // Retrieve root resource for URLs
  getRoot(options = {}) {
    $.extend(options, this.defaultAjaxOptions);
    options.url = this.baseURL;
    return Q($.ajax(options));
  }

  getThing(id, options = {}) {
    return Q(this.getLinks())
    .then((links) => {
      $.extend(options, this.defaultAjaxOptions);
      options.url = links["Things"] + `(${id})`;
      return Q($.ajax(options))
      .then((response) => {
        return new Thing(response);
      });
    });
  }

  getThings(options = {}) {
    return Q(this.getLinks())
    .then((links) => {
      $.extend(options, this.defaultAjaxOptions);
      options.url = links["Things"];
      return Q($.ajax(options))
      .then((response) => {
        return response.value.map(function(item) {
          return new Thing(item);
        });
      });
    });
  }
}

export default SensorThings;
