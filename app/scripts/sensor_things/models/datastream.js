import Generic from './generic';
import Observation from './observation';
import ObservedProperty from './observed_property';
import Sensor from './sensor';

class Datastream extends Generic {
  constructor(data) {
    super(data);

    this.observedProperty = null;
    this.sensor           = null;

    // Extract embedded ObservedProperty
    if (this.get("ObservedProperty")) {
      this.observedProperty = new ObservedProperty(this.get("ObservedProperty"));
      delete this.attributes["ObservedProperty"];
    }

    // Extract embedded Sensor
    if (this.get("Sensor")) {
      this.sensor = new Sensor(this.get("Sensor"));
      delete this.attributes["Sensor"];
    }
  }

  // * Request Handling * //

  getObservations(options = {}) {
    $.extend(options, this.defaultAjaxOptions);
    options.url = this.get("Observations@iot.navigationLink");

    return Q($.ajax(options))
    .then((response) => {
      return response.value.map(function(item) {
        return new Observation(item);
      });
    });
  }
}

export default Datastream;
