// Settings object for accessing application preferences

window.Settings = {
  getSensorThingsURL() {
    return localStorage.getItem('sensorThingsURL');
  },

  setSensorThingsURL(url) {
    return localStorage.setItem('sensorThingsURL', url);
  }
};
