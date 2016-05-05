// Settings class for accessing application preferences
class Settings {
  getSensorThingsURL() {
    var val = localStorage.getItem('sensorThingsURL');
    if (val === null) {
      val = "http://scratchpad.sensorup.com/OGCSensorThings/v1.0/";
    }
    return val;
  }

  setSensorThingsURL(url) {
    return localStorage.setItem('sensorThingsURL', url);
  }
}

export default Settings;
