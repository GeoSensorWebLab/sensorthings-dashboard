// Generate data for NVD3 charts
class SampleData {
  constructor(options) {
    var sin = [];
    var tickCount = 100;

    for (var i = 0; i < tickCount; i++) {
      // start date + offset
      var x = 1462309518 + i * 10 * 60;
      sin.push({ x: x * 1000, y: Math.sin(i/10) });
    }

    this.series = [
      {
        area: true,
        values: sin,
        key: "Series",
        color: options.color || "#ff7f0e",
        strokeWidth: 4,
        classed: 'dashed'
      }
    ];
  }
}

export default SampleData;
