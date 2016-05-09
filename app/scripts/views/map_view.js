import BaseMap from '../maps/base_map';

var MapView = (function() {
  // Update query params in URL, get SensorThings URL from query params
  // or from LocalStorage.
  App.ParamsController.activate();
  var ST = new App.SensorThings(App.ParamsController.get("stURL"));

  // Things
  var Things = ST.getThings({
    data: {
      "$expand": "Datastreams,Locations"
    }
  });

  // Map

  var MapManager = new BaseMap('map');

  MapManager.map.setView([51.049, -114.08], 8);

  // Data Load Handler
  Q(Things).then(function(things) {

    // Populate List
    things.forEach(function(thing) {
      var properties = $.extend({}, thing.attributes, {
        datastreamsCount: thing.datastreams.length,
        stURL: encodeURIComponent(App.ParamsController.get("stURL")),
        pluralize: pluralize
      });
      var template = JST["thing-list-item"](properties);
      $("#things-list ul").append(template);
    });

    // Load feature markers asynchronously.
    things.forEach(function(thing) {
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
        }
      });
    });

    // Highlight markers when corresponding item is highlighted in list.
    // Only activate once things have been loaded
    var activeStyle = function() {
      return { opacity: 0.5, fillOpacity: 0.2 };
    };
    var inactiveStyle = function() {
      return { opacity: 0.05, fillOpacity: 0.05 };
    };

    $("#things-list .list-group-item").on("mouseenter click", function() {
      var id = $(this).data("id");

      things.forEach(function(thing) {
        if (thing.get("mapFeature") === undefined) {
          // do nothing
        } else if (thing.get("@iot.id") === id) {
          thing.get("mapFeature").setStyle(activeStyle);
        } else {
          thing.get("mapFeature").setStyle(inactiveStyle);
        }
      });
    });

    $("#things-list .list-group").on("mouseleave", function() {
      things.forEach(function(thing) {
        var marker = thing.get("mapFeature");
        if (marker) {
          marker.setStyle(activeStyle);
        }
      });
    });

  });

  // Hide zoom controls for mobile — pinch zoom is more reliable there
  $(".leaflet-control-container").addClass("hidden-sm-down");

  // Mobile Controls

  $(".show-things-list").click(function() {
    $("#things-list").toggleClass("hidden-sm-down");
    $("#map-container").toggleClass("hidden-sm-down");
    $(".show-things-list").toggleClass("invisible");
    $(".show-things-map").toggleClass("invisible");
    return false;
  });

  $(".show-things-map").click(function() {
    $("#things-list").toggleClass("hidden-sm-down");
    $("#map-container").toggleClass("hidden-sm-down");
    $(".show-things-list").toggleClass("invisible");
    $(".show-things-map").toggleClass("invisible");
    return false;
  });
});

export default MapView;
