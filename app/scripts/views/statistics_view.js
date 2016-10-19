// View class for statistics table on a Datastream.
// Call update() with an array of Observations to render statistics for that
// set of Observations.
class StatisticsView {
  constructor(elementSelector, unitOfMeasurement) {
    this.$element = $(elementSelector);
    this.unitOfMeasurement = unitOfMeasurement;
    this.render();
  }

  render() {
    var $template = $(JST["observation-statistics"]());
    this.$element.html($template);
  }

  // Sort numbers in ascending order
  sortAscending(a, b) {
    return a - b;
  }

  // Update statistics table with data from observations
  update(observations) {
    // Check for empty data
    if (observations.length === 0) {
      this.updateValues("N/A", "N/A", "N/A", "N/A");
    } else if (isNaN(observations[0].get("result"))) {
      // Check for non-numeric data
      this.updateValues("N/A", "N/A", "N/A", "N/A");
    } else {
      var results = observations.map(function(observation) {
        return parseFloat(observation.get("result"));
      }).filter(function(result) {
        return (result !== undefined && !isNaN(result));
      });

      var last = results[0];
      results.sort(this.sortAscending);
      var min = results[0];
      var max = results[results.length - 1];
      var average = results.reduce(function(prev, current) {
        return prev + (current / results.length);
      }, 0);

      this.updateValues(last, min, max, average);
    }
  }

  // Update statistics table with values.
  // Numbers will be formatted with either toLocaleString or with toPrecision.
  updateValues(last, min, max, average) {
    var formatNumber;
    if (Number.prototype.toLocaleString !== undefined) {
      formatNumber = function(num) {
        return num.toLocaleString(undefined, {
          minimumSignificantDigits: 1,
          maximumSignificantDigits: 5
        });
      };
    } else {
      formatNumber = function(num) {
        return num.toPrecision(3);
      };
    }

    var unit = " " + this.unitOfMeasurement.symbol;
    this.$element.find('.last-value').html(formatNumber(last) + unit);
    this.$element.find('.min-value').html(formatNumber(min) + unit);
    this.$element.find('.max-value').html(formatNumber(max) + unit);
    this.$element.find('.average-value').html(formatNumber(average) + unit);
  }
}

export default StatisticsView;
