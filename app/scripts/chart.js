import C3Chart from './c3_chart';

// Wrapper for chart libraries.
class Chart {
  // Create a new chart
  constructor(elementSelector, options = {}) {
    this.chart = new C3Chart(elementSelector, options);
  }

  // Clear the chart of data, load `observations` into chart, then redraw
  reloadWithData(observations) {
    this.chart.loadData(observations);
  }

}

export default Chart;
