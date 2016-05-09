import Chart from '../chart';
import colorForId from '../color_generator';
import transformObservations from '../transform_observations';

var SensorThingsDateFormat = "YYYY-MM-DDTHH:mm:ss.SSSZ";

class ResultView {
  constructor(datastream, options = {}) {
    this.datastream = datastream;
    this.id         = datastream.get("@iot.id");
    this.startDate  = options.startDate;
    this.endDate    = options.endDate;

    this.baseOptions = {};
    if (this.startDate !== undefined && this.endDate !== undefined) {
      this.baseOptions["$filter"] = `phenomenonTime ge ${this.startDate.format(SensorThingsDateFormat)} and phenomenonTime le ${this.endDate.format(SensorThingsDateFormat)}`;
    }

    // Draw a chart for OM_Measurement only
    if (this.datastream.get("observationType") === "http://www.opengis.net/def/observationType/OGC-OM/2.0/OM_Measurement") {
      this.drawChart();
    } else {
      this.drawLastValue();
    }
  }

  drawChart() {
    // Draw an empty chart
    $(`#datastream-${this.id}-result`).addClass('chart');
    var chart = new Chart(`#datastream-${this.id}-result`, {
      color: colorForId(this.id),
      unitOfMeasurement: this.datastream.get("unitOfMeasurement")
    });

    Q(this.datastream.getObservations({
      data: this.baseOptions
    }))
    .then((observations) => {
      $(`#datastream-${this.id}-card .observations-count`)
      .html(`<p>${observations.length} ${pluralize('Observation', observations.length)}</p>`);

      var values = transformObservations(observations);
      chart.loadData([{ key: this.datastream.get("description"), values: values }]);
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
      $(`#datastream-${this.id}-card .observations-count`)
      .html(`<p>${observations.length} ${pluralize('Observation', observations.length)}</p>`);

      if (observations[0]) {
        var $template = $(JST["observation-preview"](observations[0].attributes));
        $(`#datastream-${this.id}-result`).html($template);
      } else {
        $(`#datastream-${this.id}-result`).html("No Results in Time Range");
      }
    })
    .done();
  }
}

export default ResultView;
