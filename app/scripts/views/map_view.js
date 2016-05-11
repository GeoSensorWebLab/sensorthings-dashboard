import BaseMap from '../maps/base_map';

class MapView {
  constructor() {
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

    this.MapManager = null;
    this.initMap();

    // Data Load Handler
    Q(Things).then((things) => {
      // Populate List
      things.forEach(this.addThingToList, this);

      // Load feature markers asynchronously.
      things.forEach(this.addThingToMap, this);

      // Enable marker hover highlight
      this.activateMarkerHighlighting(things);
    });

    // Hide zoom controls for mobile — pinch zoom is more reliable there
    $(".leaflet-control-container").addClass("hidden-sm-down");

    // Mobile Controls
    this.enableMobileSwitcher();
  }

  activateMarkerHighlighting(things) {
    // Highlight markers when corresponding item is highlighted in list.
    // Only activate once things have been loaded
    var activeStyle   = { opacity: 0.5, fillOpacity: 0.2 };
    var inactiveStyle = { opacity: 0.05, fillOpacity: 0.05 };

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
  }

  addThingToList(thing) {
    var properties = $.extend({}, thing.attributes, {
      datastreamsCount: thing.datastreams.length,
      stURL: encodeURIComponent(App.ParamsController.get("stURL")),
      pluralize: pluralize
    });
    var template = JST["thing-list-item"](properties);
    $("#things-list ul").append(template);
  }

  addThingToMap(thing) {
    Q(thing.locations)
    .then((locations) => {
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
        }).addTo(this.MapManager.map);
        thing.set("mapFeature", feature);
      }
    });
  }

  enableMobileSwitcher() {
    $(".show-things-list").click(() => {
      $("#things-list").toggleClass("hidden-sm-down");
      $("#map-container").toggleClass("hidden-sm-down");
      $(".show-things-list").hide();
      $(".show-things-map").show();
      return false;
    });

    $(".show-things-map").click(() => {
      $("#things-list").toggleClass("hidden-sm-down");
      $("#map-container").toggleClass("hidden-sm-down");
      $(".show-things-list").show();
      $(".show-things-map").hide();
      this.MapManager.map.invalidateSize();
      return false;
    });
  }

  initMap() {
    this.MapManager = new BaseMap('map');
    this.MapManager.map.setView([51.049, -114.08], 8);
  }
}

export default MapView;
