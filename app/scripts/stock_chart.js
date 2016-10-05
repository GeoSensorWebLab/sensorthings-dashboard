class StockChart {
  constructor(elementSelector, options = {}) {
    this.stockChart = null;
    this.color = options.color;
    this.elementSelector = elementSelector;
    $(this.elementSelector).addClass('chart');

    this.observedProperty = options.observedProperty.attributes || {
      name: "Unknown"
    };

    this.uom = options.unitOfMeasurement || {
      name: "Unknown",
      symbol: ""
    };

    this.render();
  }

  // Initialize and draw the chart
  render() {
    var elementID = $(this.elementSelector).attr("id");
    this.stockChart = new Highcharts.StockChart(elementID, {
      tooltip: {
        valueDecimals: 2,
        valueSuffix: " " + this.uom.symbol
      },

      xAxis: [{
        description: "Date and Time of Observation",
        ordinal: false,
        title: { text: "Phenomenon Time" }
      }],

      yAxis: [{
        description: "Result value for Observations",
        labels: {
          format: "{value} " + this.uom.symbol
        },
        title: { text: this.observedProperty.name }
      }]
    });
  }

  // Convert array of observations into array of [timestamp, value] pairs
  convertObservations(observations) {
    return $.map(observations, function(item) {
      return [[
        moment(item.attributes.phenomenonTime).valueOf(),
        parseFloat(item.attributes.result)
      ]];
    });
  }

  // Sort array of [timestamp, value] pairs by timestamp
  sortData(data) {
    return data.sort(function(a, b) {
      return a[0] - b[0];
    });
  }

  loadData(observations) {
    var data = this.sortData(this.convertObservations(observations));
    this.stockChart.addSeries({
      name: 'Observations',
      data: data
    });
  }
}

export default StockChart;
