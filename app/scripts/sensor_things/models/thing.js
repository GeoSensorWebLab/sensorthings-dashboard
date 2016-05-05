import Location from './location';

class Thing {
  constructor(data) {
    // Copy properties to this instance
    this.attributes = data;
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
