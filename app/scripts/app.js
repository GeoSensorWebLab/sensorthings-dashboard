// Start with your ES5/6/7 script here.
// Import other files or use Browserify require statements.
import Downloader from './downloader';
import MapView from './views/map_view';
import ParamsController from './params_controller';
import Settings from './settings';
import SettingsView from './views/settings_view';
import ThingView from './views/thing_view';

var settings = new Settings();

window.App = {
  ParamsController: new ParamsController({ settings: settings }),
  SensorThings: EclipseWhiskers.Backend,
  Settings: settings,
  Views: {
    MapView:      MapView,
    SettingsView: SettingsView,
    ThingView:    ThingView
  }
};

window.Downloader = Downloader;
