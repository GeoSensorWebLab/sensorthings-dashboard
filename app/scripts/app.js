// Start with your ES5/6/7 script here.
// Import other files or use Browserify require statements.
import MapView from './views/map_view';
import ParamsController from './params_controller';
import SensorThings from './sensor_things/sensor_things';
import Settings from './settings';
import SettingsView from './views/settings_view';
import ThingView from './views/thing_view';

var settings = new Settings();

window.App = {
  ParamsController: new ParamsController({ settings: settings }),
  SensorThings: SensorThings,
  Settings: settings,
  Views: {
    MapView:      MapView,
    SettingsView: SettingsView,
    ThingView:    ThingView
  }
};
