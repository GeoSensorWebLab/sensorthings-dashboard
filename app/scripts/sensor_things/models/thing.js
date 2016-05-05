import Datastream from './datastream';
import Location from './location';

class Thing {
  constructor(data) {
    // Copy properties to this instance
    this.attributes = data;

    this.datastreams = [];
    this.locations   = [];

    // Extract embedded Datastreams
    if (this.get("Datastreams")) {
      this.datastreams = this.get("Datastreams").map(function(item) {
        return new Datastream(item);
      });
      delete this.attributes["Datastreams"];
    }

    // Extract embedded Locations
    if (this.get("Locations")) {
      this.locations = this.get("Locations").map(function(item) {
        return new Location(item);
      });
      delete this.attributes["Locations"];
    }
  }

  get(key) {
    return this.attributes[key];
  }

  set(key, value) {
    this.attributes[key] = value;
  }

  // * Request Handling * //

  getLocations(options = {}) {
    $.extend(options, this.defaultAjaxOptions);
    options.url = this.get("Locations@iot.navigationLink");

    return Q($.ajax(options))
    .then((response) => {
      return response.value.map(function(item) {
        return new Location(item);
      });
    });
  }
}

export default Thing;
