import ResultView from './result_view';
import StaticMap from '../maps/static_map';

var ThingView = (function() {
  // Update query params in URL, get SensorThings URL from query params
  // or from LocalStorage.
  App.ParamsController.activate();
  var ST = new App.SensorThings(App.ParamsController.get("stURL"));

  var Thing = ST.getThing(App.ParamsController.get("id"), {
    data: {
      "$expand": "Locations"
    }
  });

  // Map
  var MapManager = new StaticMap('map');
  MapManager.map.setView([51.049, -114.08], 13);

  // Data Load Handler
  Q(Thing).then(function(thing) {
    // Load Metadata
    var properties = $.extend({}, thing.attributes, {
      locationDescription: thing.locations[0].get("description")
    });
    var template = JST["thing-info"](properties);
    $("#thing-info").html(template);
    $("#thing-description").html(thing.get("description"));

    // Load feature marker
    Q(thing.locations)
    .then(function(locations) {
      var location = locations[0];
      if (location && location.get("location")) {
        // Generate HTML for popup
        var properties = $.extend({}, thing.attributes, {
          stURL: encodeURIComponent(App.ParamsController.get("stURL"))
        });
        var template = JST["marker-popup"](properties);

        // We use circle markers as we can style them with path CSS.
        var createMarker = function(feature, latlng) {
          var marker = L.circleMarker(latlng);
          marker.bindPopup(template);
          return marker;
        };

        var feature = L.geoJson(location.get("location"), {
          pointToLayer: createMarker
        }).addTo(MapManager.map);
        thing.set("mapFeature", feature);
        MapManager.map.fitBounds(feature.getBounds());
      }
    });

    // Load Datastreams
    Q(thing.getDatastreams({
      data: {
        "$expand": "Sensor,ObservedProperty"
      }
    }))
    .then(function(datastreams) {
      datastreams.forEach(function(datastream) {
        // Draw template for each datastream
        var $template = $(JST["datastream-card"](datastream.attributes));
        $("#datastreams").append($template);

        var sensorTemplate = JST["sensor-info"](datastream.sensor.attributes);
        $template.find(".sensor-attributes").append(sensorTemplate);

        var propertyTemplate = JST["observed-property-info"](datastream.observedProperty.attributes);
        $template.find(".observed-property-attributes").append(propertyTemplate);

        // Draw Results
        new ResultView(datastream);
      });
    });
  })
  .done();
});

export default ThingView;
