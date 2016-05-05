// Settings class for accessing application preferences
class Settings {
  getSensorThingsURL() {
    return localStorage.getItem('sensorThingsURL');
  }

  setSensorThingsURL(url) {
    return localStorage.setItem('sensorThingsURL', url);
  }
}

export default Settings;
