var ThingView = (function() {
  // Update query params in URL, get SensorThings URL from query params
  // or from LocalStorage.
  ParamsController.activate();
  var ST = new SensorThings(ParamsController.get("stURL"));

  var Thing = ST.getThing(ParamsController.get("id"), {
    data: {
      "$expand": "Locations"
    }
  });

  // Map

  L.Icon.Default.imagePath = "/images";

  var map = L.map('map', {
    dragging: false,
    touchZoom: false,
    scrollWheelZoom: false,
    doubleClickZoom: false,
    boxZoom: false,
    keyboard: false,
    zoomControl: false
  }).setView([51.049, -114.08], 13);

  L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map);

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
          stURL: encodeURIComponent(ParamsController.get("stURL"))
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
        }).addTo(map);
        thing.set("mapFeature", feature);
        map.fitBounds(feature.getBounds());
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
        var id = datastream.get("@iot.id");

        // Draw template for each datastream
        var $template = $(JST["datastream-card"](datastream.attributes));
        $("#datastreams").append($template);

        var sensorTemplate = JST["sensor-info"](datastream.sensor.attributes);
        $template.find(".sensor-attributes").append(sensorTemplate);

        var propertyTemplate = JST["observed-property-info"](datastream.observedProperty.attributes);
        $template.find(".observed-property-attributes").append(propertyTemplate);

        // Draw a chart for OM_Measurement only
        if (datastream.get("observationType") !== "http://www.opengis.net/def/observationType/OGC-OM/2.0/OM_Measurement") {
          $(`#datastream-${id}-result`).html("Loading results…");

          Q(datastream.getObservations({
            data: {
              "$orderby": "phenomenonTime desc",
              "$top": 1
            }
          }))
          .then(function(observations) {
            $(`#datastream-${id}-card .observations-count`)
            .html(`<p>${observations.length} ${pluralize('Observation', observations.length)}</p>`);

            var $template = $(JST["observation-preview"](observations[0].attributes));
            $(`#datastream-${id}-result`).html($template);
          })
          .done();

        } else {
          // Draw an empty chart
          $(`#datastream-${id}-result`).addClass('chart');
          var chart = new Chart(`#datastream-${id}-result`, {
            color: colorForId(id),
            unitOfMeasurement: datastream.get("unitOfMeasurement")
          });

          Q(datastream.getObservations())
          .then(function(observations) {
            $(`#datastream-${id}-card .observations-count`)
            .html(`<p>${observations.length} ${pluralize('Observation', observations.length)}</p>`);

            var values = transformObservations(observations);
            chart.loadData([{ key: datastream.get("description"), values: values }]);
          })
          .done();
        }
      });
    });
  })
  .done();
});

export default ThingView;
