// Wrap access to a chart using this module.
// This abstracts access to the underlying chart library.
import SampleData from './sample_data';

class Chart {
  constructor(element_id, options = {}) {
    this.chart = null;
    this.color = options.color;
    this.data = [];
    this.element_id = element_id;
    this.svgElem = null;

    this.uom = options.unitOfMeasurement || {
      name: "Unknown",
      symbol: ""
    };
    this.tickMultiFormat = d3.time.format.multi([
      ["%-I:%M%p", function(d) { return d.getMinutes(); }], // not the beginning of the hour
      ["%-I%p", function(d) { return d.getHours(); }], // not midnight
      ["%b %-d", function(d) { return d.getDate() != 1; }], // not the first of the month
      ["%b %-d", function(d) { return d.getMonth(); }], // not Jan 1st
      ["%Y", function() { return true; }]
    ]);

    this.initDraw();
  }

  // Initialize and draw the chart
  initDraw() {
    nv.addGraph(() => {
      this.chart = nv.models.lineChart()
        .xScale(d3.time.scale())
        .clipEdge(false)
        .margin({left: 70})
        .noData("Retrieving data…")
        .showLegend(false)
        .useInteractiveGuideline(true);

      this.initXAxis();
      this.initYAxis();

      this.svgElem = d3.select(this.element_id).append('svg');
      this.svgElem
        .datum([])
        .transition()
        .call(this.chart);

      this.initXAxisTicks();
      this.initTooltips();

      nv.utils.windowResize(this.chart.update);
      return this.chart;
    });
  }

  initTooltips() {
    var tsFormat = d3.time.format('%b %-d, %Y %I:%M%p %Z');
    var contentGenerator = this.chart.interactiveLayer.tooltip.contentGenerator();
    var tooltip = this.chart.interactiveLayer.tooltip;
    tooltip.contentGenerator((d) => {
      d.value = d.series[0].data.x;
      return contentGenerator(d);
    });
    tooltip.headerFormatter((d) => {
      return tsFormat(new Date(d));
    });
  }

  initXAxis() {
    this.chart.xAxis
      .showMaxMin(true)
      .tickFormat((d) => { return this.tickMultiFormat(new Date(d)); });
  }

  initXAxisTicks() {
    // make our own x-axis tick marks because NVD3 doesn't provide any
    var tickY2 = this.chart.yAxis.scale().range()[1];
    var lineElems = this.svgElem.select('.nv-x.nv-axis.nvd3-svg')
      .select('.nvd3.nv-wrap.nv-axis')
      .select('g')
      .selectAll('.tick')
      .data(this.chart.xScale().ticks())
      .append('line')
      .attr('class', 'x-axis-tick-mark')
      .attr('x2', 0)
      .attr('y1', tickY2 + 4)
      .attr('y2', tickY2)
      .attr('stroke-width', 1);
  }

  initYAxis() {
    this.chart.yAxis
      .axisLabel(this.uom.name || "Unknown")
      .axisLabelDistance(10)
      .tickFormat((d) => {
        if (d === null) {
          return 'N/A';
        }
        return d + " " + this.uom.symbol;
      });
  }

  loadData(data) {
    data.forEach((series) => {
      series.color = this.color;
    });

    this.svgElem
      .style("opacity", 0.0)
      .datum(data)
      .transition()
      .style("opacity", 1.0)
      .duration(500)
      .call(this.chart);
  }
}

export default Chart;
