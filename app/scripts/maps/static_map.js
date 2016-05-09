import BaseMap from './base_map';

// A Leaflet Map with interaction disabled. Good for small mobile maps
// where you don't want to accidentally catch input.
class StaticMap extends BaseMap {
  constructor(elementID) {
    super(elementID, {
      dragging: false,
      touchZoom: false,
      scrollWheelZoom: false,
      doubleClickZoom: false,
      boxZoom: false,
      keyboard: false,
      zoomControl: false
    });
  }
}

export default StaticMap;
