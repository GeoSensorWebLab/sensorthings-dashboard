import ResultView from './result_view';
import StaticMap from '../maps/static_map';
import TimeRangePickerView from './time_range_picker_view';

// View class for page showing a single Thing and a list of Datastreams. Each
// Datastream will render a ResultView.
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

    this.MapManager = null;
    this.initMap();

    // Time Range Picker
    this.dateRange = Q.defer();
    this.dateChangeFunctions = [];
    this.initTimeRangePicker();

    // Data Load Handler
    Q(Thing).then((thing) => {
      // Load Metadata
      this.renderMetadata(thing);

      // Load feature marker
      Q(thing.locations)
      .then((locations) => {
        var location = locations[0];
        if (location && location.get("location")) {
          this.addToMap(thing, location);
        } else {
          console.warn("Location could not be added to Map. Check `location` attribute.");
        }
      });

      // Load Datastreams
      Q(thing.getDatastreams({
        data: {
          "$expand": "Sensor,ObservedProperty"
        }
      }))
      .then((datastreams) => {
        datastreams.forEach(this.renderDatastream, this);
      })
      .done();
    })
    .done();
  }

  addToMap(thing, location) {
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
    }).addTo(this.MapManager.map);
    thing.set("mapFeature", feature);
    this.MapManager.map.fitBounds(feature.getBounds());
  }

  initMap() {
    this.MapManager = new StaticMap('map');
    this.MapManager.map.setView([51.049, -114.08], 13);
  }

  // Create the Time Range Picker.
  // Will resolve a Deferred Promise object for this.dateRange that can be used
  // for callbacks in other functions.
  initTimeRangePicker() {
    new TimeRangePickerView("#time-range-picker", {
      onChange: (startDate, endDate) => {
        this.dateChangeFunctions.forEach((fn) => {
          fn.apply(this, [startDate, endDate]);
        });
      },

      onLoad: (startDate, endDate) => {
        this.dateRange.resolve({ startDate: startDate, endDate: endDate });
      }
    });
  }

  renderDatastream(datastream) {
    // Draw template for each datastream
    var $template = $(JST["datastream-card"](datastream.attributes));
    $("#datastreams").append($template);

    var sensorTemplate = JST["sensor-info"](datastream.sensor.attributes);
    $template.find(".sensor-attributes").append(sensorTemplate);

    var propertyTemplate = JST["observed-property-info"](datastream.observedProperty.attributes);
    $template.find(".observed-property-attributes").append(propertyTemplate);

    // Draw Results
    return Q(this.dateRange.promise)
    .then((dateRange) => {
      var id = datastream.get("@iot.id");

      var view = new ResultView(datastream, `#datastream-${id}-card`, {
        startDate: dateRange.startDate,
        endDate: dateRange.endDate
      });

      this.dateChangeFunctions.push((startDate, endDate) => {
        view.update(startDate, endDate);
      });
    })
    .done();
  }

  renderMetadata(thing) {
    var properties = $.extend({}, thing.attributes, {
      locationDescription: thing.locations[0].get("description")
    });
    var template = JST["thing-info"](properties);
    $("#thing-info").html(template);
    $("#thing-description").html(thing.get("description"));
  }
}

export default ThingView;
