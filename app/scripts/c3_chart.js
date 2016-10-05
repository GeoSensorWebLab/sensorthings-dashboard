class C3Chart {
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
    this.chart = c3.generate({
      axis: {
        x: {
          label: 'date',
          type: 'timeseries',
          tick: {
            count: 10,
            culling: { max: 5 },
            format: '%Y-%m-%d %H:%M:%S %Z'
          }
        },

        y: {
          label: this.uom.name,
          tick: {
            format: (d) => { return d + " " + this.uom.symbol; }
          }
        }
      },

      bindto: this.elementSelector,

      data: {
        x: 'x',
        colors: {
          'result': `#${this.color}`
        },
        columns: [
        ]
      },

      legend: {
        show: false
      }
    });
  }

  loadData(observations) {
    if (this.chart) {
      var x = ['x'];
      var y = ['result'];
      x = x.concat(this.getObservationsX(observations));
      y = y.concat(this.getObservationsY(observations));

      this.chart.load({
        columns: [x,y],
        unload: ['result']
      });
    }
  }

  // Transform observations into an array of phenomenonTimes
  getObservationsX(observations) {
    return observations.map(function(obs) {
      return moment(obs.get("phenomenonTime")).valueOf();
    });
  }

  // Transform observations into an array of result (as Floats)
  getObservationsY(observations) {
    return observations.map(function(obs) {
      return parseFloat(obs.get("result"));
    });
  }
}

export default C3Chart;
