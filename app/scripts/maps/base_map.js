// A simple Leaflet Map with no custom options.
class BaseMap {
  constructor(elementID, options = {}) {
    L.Icon.Default.imagePath = "/images";

    this.map = L.map(elementID, options);

    L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(this.map);
  }
}

export default BaseMap;
