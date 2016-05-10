class StatisticsView {
  constructor(elementSelector) {
    this.$element = $(elementSelector);

    this.render();
  }

  render() {
    var $template = $(JST["observation-statistics"]());
    this.$element.html($template);
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
      });

      var last = results[0];
      results.sort(function(a, b) {
        return a - b;
      });
      var min = results[0];
      var max = results[results.length - 1];
      var average = results.reduce(function(prev, current) {
        return prev + (current / results.length);
      }, 0);

      this.updateValues(last, min, max, average);
    }
  }

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

    this.$element.find('.last-value').html(formatNumber(last));
    this.$element.find('.min-value').html(formatNumber(min));
    this.$element.find('.max-value').html(formatNumber(max));
    this.$element.find('.average-value').html(formatNumber(average));
  }
}

export default StatisticsView;