import BaseMap from '../maps/base_map';

class MapView {
  constructor() {
    // Update query params in URL, get SensorThings URL from query params
    // or from LocalStorage.
    App.ParamsController.activate();
    this.ST = new App.SensorThings(App.ParamsController.get("stURL"));

    this.MapManager = null;
    this.mapResults = L.featureGroup();
    this.initMap();
    this.initSearch();

    this.clearList();
    this.clearMap();
    this.loadThings();

    // Hide zoom controls for mobile — pinch zoom is more reliable there
    $(".leaflet-control-container").addClass("hidden-sm-down");

    // Mobile Controls
    this.enableMobileSwitcher();
  }

  activateMarkerHighlighting(things) {
    // Highlight markers when corresponding item is highlighted in list.
    // Only activate once things have been loaded
    var activeStyle   = { color: 'blue', opacity: 0.5, fillOpacity: 0.2, radius: 10 };
    var inactiveStyle = { color: 'gray', opacity: 0.05, fillOpacity: 0.05, radius: 5 };

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

  addLocationToMap(location, thing) {
    if (location && location.get("location")) {
      var errors = geojsonhint.hint(location.get("location"));
      if (errors.length > 0) {
        console.warn("Location has invalid GeoJSON", encodeURI(location.get("@iot.selfLink")), errors);
      } else {
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
      })

      feature.addTo(this.mapResults);
      thing.set("mapFeature", feature);
      }
    }
  }

  clearList() {
    $("#things-list ul").empty();
  }

  clearMap() {
    this.mapResults.clearLayers();
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
    this.mapResults.addTo(this.MapManager.map);
  }

  initSearch() {
    var $input = $("#things-search input[name=query]");
    var $formWarning = $("#things-search .form-warning");

    $input.on({
      blur: () => { $formWarning.slideUp(); },
      focus: () => { $formWarning.slideDown(); }
    });

    $("#things-search").on("submit", () => {
      // Validate search query
      var query = $input.val();
      if (query === "") {
        console.warn("Blank search query ignored.");
      }  else {
        this.clearList();
        this.clearMap();
        this.loadThings(`substringof('${query}',description)`);
      }

      // Prevent form submission
      return false;
    });
  }

  // Retrieve Things from the server (defined in settings) and add them to
  // the "sensor stations" list.
  // If `filter` is undefined, the latest 100 Things will be returned.
  loadThings(filter) {
    var queryParams = { "$expand": "Datastreams,Locations" };
    if (filter !== undefined) {
      queryParams["$filter"] = filter;
    }

    var Things = this.ST.getThings({
      data: queryParams
    });

    // Data Load Handler
    Q(Things).then((things) => {
      // Populate List
      things.forEach(this.addThingToList, this);

      // Convert array of things to array of promises to load location markers,
      // then re-zoom when all promises are resolved.
      Q.allSettled(things.map((thing) => {
        return Q(thing.locations)
        .then((locations) => {
          var location = locations[0];
          this.addLocationToMap(location, thing);
        });
      }, this))
      .done(() => {
        this.MapManager.map.fitBounds(this.mapResults.getBounds());

        // Enable marker hover highlight
        this.activateMarkerHighlighting(things);
      });
    })
    .done();
  }
}

export default MapView;
