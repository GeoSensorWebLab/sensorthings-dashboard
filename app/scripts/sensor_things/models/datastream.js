import Generic from './generic';
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
}

export default Datastream;
