class StockChart {
  constructor(elementSelector, options = {}) {
    this.chart = null;
    this.color = options.color;
    this.elementSelector = elementSelector;
    $(this.elementSelector).addClass('chart');

    this.uom = options.unitOfMeasurement || {
      name: "Unknown",
      symbol: ""
    };

    this.render();
  }

  // Initialize and draw the chart
  render() {
    this.chart = $(this.elementSelector).highcharts("StockChart", {
    });
  }

  // Convert array of observations into array of [time, value] pairs
  convertObservations(observations) {
    return $.map(observations, function(item) {
      return [item.attributes.phenomenonTime, item.attributes.result];
    });
  }

  loadData(observations) {
    var data = this.convertObservations(observations);
    console.log("howdy");
    this.chart.addSeries({
      name: 'values',
      data: data
    });
  }
}

export default StockChart;
