// Start with your ES5/6/7 script here.
// Import other files or use Browserify require statements.
import './chart';
import './color_generator';
import './notifier';
import ParamsController from './params_controller';
import SensorThings from './sensor_things/sensor_things';
import Settings from './settings';

window.Settings = new Settings();
window.ParamsController = new ParamsController({ settings: window.Settings });
window.SensorThings = SensorThings;
