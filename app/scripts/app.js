// Start with your ES5/6/7 script here.
// Import other files or use Browserify require statements.

function hashFnv32a(str, asString, seed) {
  /*jshint bitwise:false */
  var i, l,
  hval = (seed === undefined) ? 0x811c9dc5 : seed;

  for (i = 0, l = str.length; i < l; i++) {
    hval ^= str.charCodeAt(i);
    hval += (hval << 1) + (hval << 4) + (hval << 7) + (hval << 8) + (hval << 24);
  }
  if(asString) {
    // Convert to 8 digit hex string
    return ("0000000" + (hval >>> 0).toString(16)).substr(-8);
  }
  return hval >>> 0;
}

// return a deterministic line color for a given number.
// This causes each datastream to always receive the same line colour.
window.colorForId = function(id) {  
  return hashFnv32a(id.toString(), true).substr(2, 8);
};

window.sampleChartData = function(options) {
  var sin = [];
  var tickCount = 100;

  for (var i = 0; i < tickCount; i++) {
    // start date + offset
    var x = 1462309518 + i * 10 * 60;
    sin.push({ x: x * 1000, y: Math.sin(i/10) });
  }

  return [
    {
      area: true,
      values: sin,
      key: "Series",
      color: options.color || "#ff7f0e",
      strokeWidth: 4,
      classed: 'dashed'
    }
  ];
};

window.drawChart = function(element, options = {}) {
  var chart, data;

  var uom = options.unitOfMeasurement || {
    name: "Unknown",
    symbol: ""
  };

  nv.addGraph(function() {
    chart = nv.models.lineChart()
    .xScale(d3.time.scale())
    .options({
      clipEdge: false,
      showLegend: false,
      transitionDuration: 300,
      useInteractiveGuideline: true
    });

    var tickMultiFormat = d3.time.format.multi([
      ["%-I:%M%p", function(d) { return d.getMinutes(); }], // not the beginning of the hour
      ["%-I%p", function(d) { return d.getHours(); }], // not midnight
      ["%b %-d", function(d) { return d.getDate() != 1; }], // not the first of the month
      ["%b %-d", function(d) { return d.getMonth(); }], // not Jan 1st
      ["%Y", function() { return true; }]
    ]);

    chart.xAxis
    .showMaxMin(true)
    .tickFormat(function (d) { return tickMultiFormat(new Date(d)); });

    chart.yAxis
    .axisLabel(uom.name || "Unknown")
    .tickFormat(function(d) {
      if (d === null) {
        return 'N/A';
      }
      return d3.format(',.2f')(d) + " " + uom.symbol;
    });

    data = sampleChartData({
      color: options.color
    });

    var svgElem = d3.select(element).append('svg');
    svgElem.datum(data).transition().call(chart);

    // make our own x-axis tick marks because NVD3 doesn't provide any
    var tickY2 = chart.yAxis.scale().range()[1];
    var lineElems = svgElem.select('.nv-x.nv-axis.nvd3-svg')
    .select('.nvd3.nv-wrap.nv-axis')
    .select('g')
    .selectAll('.tick')
    .data(chart.xScale().ticks())
    .append('line')
    .attr('class', 'x-axis-tick-mark')
    .attr('x2', 0)
    .attr('y1', tickY2 + 4)
    .attr('y2', tickY2)
    .attr('stroke-width', 1);

    var tsFormat = d3.time.format('%b %-d, %Y %I:%M%p %Z');
    var contentGenerator = chart.interactiveLayer.tooltip.contentGenerator();
    var tooltip = chart.interactiveLayer.tooltip;
    tooltip.contentGenerator(function (d) {
      d.value = d.series[0].data.x;
      return contentGenerator(d);
    });
    tooltip.headerFormatter(function (d) {
      return tsFormat(new Date(d));
    });

    nv.utils.windowResize(chart.update);
    return chart;
  });
};
