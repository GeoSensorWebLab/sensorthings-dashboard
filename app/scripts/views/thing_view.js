import ResultView from './result_view';
import StaticMap from '../maps/static_map';
import TimeRangePickerView from './time_range_picker_view';

class ThingView {
  constructor() {
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

    // Time Range Picker
    var dateRange = Q.defer();
    var dateChangeFunctions = [];

    new TimeRangePickerView("#time-range-picker", {
      onChange: function(startDate, endDate) {
        dateChangeFunctions.forEach(function(fn) {
          fn.apply(this, [startDate, endDate]);
        });
      },

      onLoad: function(startDate, endDate) {
        dateRange.resolve({ startDate: startDate, endDate: endDate });
      }
    });

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
          Q(dateRange.promise)
          .then((dateRange) => {
            var id = datastream.get("@iot.id");

            var view = new ResultView(datastream, `#datastream-${id}-card`, {
              startDate: dateRange.startDate,
              endDate: dateRange.endDate
            });

            dateChangeFunctions.push(function(startDate, endDate) {
              view.update(startDate, endDate);
            });
          })
          .done();
        });
      });
    })
    .done();
  }
}

export default ThingView;
