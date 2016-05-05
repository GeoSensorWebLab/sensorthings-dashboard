// Start with your ES5/6/7 script here.
// Import other files or use Browserify require statements.
import './chart';
import './color_generator';

window.Settings = {
  getSensorThingsURL() {
    return localStorage.getItem('sensorThingsURL');
  },

  setSensorThingsURL(url) {
    return localStorage.setItem('sensorThingsURL', url);
  }
};

window.Notify = {
  error(msg) {
    $("#notify > div").hide();
    $("#notify .error").show().html(msg);
  },

  success(msg) {
    $("#notify > div").hide();
    $("#notify .success").show().html(msg);
  },

  warning(msg) {
    $("#notify > div").hide();
    $("#notify .warning").show().html(msg);
  }
};
