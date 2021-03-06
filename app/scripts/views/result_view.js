import Chart from '../chart';
import colorForId from '../color_generator';
import StatisticsView from './statistics_view';

var SensorThingsDateFormat = "YYYY-MM-DDTHH:mm:ss.SSSZ";

class ResultView {
  constructor(datastream, elementSelector, options = {}) {
    this.datastream        = datastream;
    this.$element          = $(elementSelector);
    this.id                = datastream.get("@iot.id");
    this.startDate         = options.startDate;
    this.endDate           = options.endDate;
    this.observationsCache = [];

    this.baseOptions = {};
    this.updateBaseOptions();

    this.statisticsView = new StatisticsView(
      this.$element.find(".observation-statistics"),
      this.datastream.get("unitOfMeasurement")
    );

    this.render();
  }

  render() {
    // Draw a chart for OM_Measurement only
    if (this.datastream.get("observationType") === "http://www.opengis.net/def/observationType/OGC-OM/2.0/OM_Measurement") {
      this.drawChart();
    } else {
      this.drawLastValue();
    }
  }

  cacheObservations(observations) {
    this.observationsCache = observations.sort(function(a, b) {
      return moment(a.get("phenomenonTime")) - moment(b.get("phenomenonTime"));
    });
  }

  // Convert observations to CSV then download to file
  downloadObservationsCSV() {
    var data = `datastream,${this.datastream.get("@iot.selfLink")}\n`;
    data += "phenomenonTime,resultTime,result\n";
    data += this.observationsCache.map((o) => {
      return [
        o.get("phenomenonTime"),
        o.get("resultTime"),
        o.get("result")
      ].join(",");
    }).join("\n");
    Downloader(data, `datastream-${this.id}-observations.csv`, "text/csv");
  }

  drawChart() {
    // Draw an empty chart
    this.$element.find(`#datastream-${this.id}-result`);
    var chart = new Chart(`#datastream-${this.id}-result`, {
      color: colorForId(this.id),
      observedProperty: this.datastream.observedProperty,
      unitOfMeasurement: this.datastream.get("unitOfMeasurement")
    });

    Q(this.datastream.getAllObservations({ data: this.baseOptions}))
    .then((observations) => {
      this.cacheObservations(observations);

      $(`#datastream-${this.id}-card .observations-count`)
      .html(`<p>${observations.length} ${pluralize('Observation', observations.length)}</p>`);

      if (observations.length === 0) {
        $(`#datastream-${this.id}-result`).html("No Results in Time Range");
        this.statisticsView.update([]);
      } else {
        chart.reloadWithData(observations.slice(0));

        // Update statistics. Use slice to clone array.
        this.statisticsView.update(observations.slice(0));
      }
    })
    .done();
  }

  drawLastValue() {
    $(`#datastream-${this.id}-result`).html("Loading results…");

    Q(this.datastream.getObservations({
      data: $.extend(this.baseOptions, {
        "$orderby": "phenomenonTime desc",
        "$top": 1
      })
    }))
    .then((observations) => {
      this.$element.find(`.observations-count`)
      .html(`<p>${observations.length} ${pluralize('Observation', observations.length)}</p>`);

      if (observations[0]) {
        var $template = $(JST["observation-preview"](observations[0].attributes));
        $(`#datastream-${this.id}-result`).html($template);
      } else {
        $(`#datastream-${this.id}-result`).html("No Results in Time Range");
      }

      // Update statistics. Use slice to clone array.
      this.statisticsView.update(observations.slice(0));
    })
    .done();
  }

  // Redraw results for new time period
  update(startDate, endDate) {
    this.startDate = startDate;
    this.endDate   = endDate;
    this.updateBaseOptions();
    this.$element.find(`#datastream-${this.id}-result`).empty();
    this.$element.find(`.observations-count`).html("");
    this.statisticsView.update([]);

    this.render();
  }

  // Add $filter to options, if time period is available
  updateBaseOptions() {
    if (this.startDate !== undefined && this.endDate !== undefined) {
      this.baseOptions["$filter"] = `phenomenonTime ge ${this.startDate.format(SensorThingsDateFormat)} and phenomenonTime le ${this.endDate.format(SensorThingsDateFormat)}`;
    } else {
      delete this.baseOptions["$filter"];
    }
  }
}

export default ResultView;
