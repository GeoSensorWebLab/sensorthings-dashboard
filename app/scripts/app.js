// Start with your ES5/6/7 script here.
// Import other files or use Browserify require statements.
import './chart';
import './color_generator';
import './notifier';
import ParamsController from './params_controller';
import './settings';

window.ParamsController = new ParamsController({ settings: Settings });
