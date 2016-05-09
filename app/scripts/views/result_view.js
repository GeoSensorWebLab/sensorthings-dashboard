import Chart from '../chart';
import colorForId from '../color_generator';
import transformObservations from '../transform_observations';

class ResultView {
  constructor(datastream) {
    this.datastream = datastream;
    this.id         = datastream.get("@iot.id");

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

    Q(this.datastream.getObservations())
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
      data: {
        "$orderby": "phenomenonTime desc",
        "$top": 1
      }
    }))
    .then((observations) => {
      $(`#datastream-${this.id}-card .observations-count`)
      .html(`<p>${observations.length} ${pluralize('Observation', observations.length)}</p>`);

      var $template = $(JST["observation-preview"](observations[0].attributes));
      $(`#datastream-${this.id}-result`).html($template);
    })
    .done();
  }
}

export default ResultView;
