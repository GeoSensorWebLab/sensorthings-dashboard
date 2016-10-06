import Notifier from '../notifier';
var ISODateFormat = 'YYYY-MM-DD[T]HH:mm:ssZ';

// Draw a time range picker in an HTML element.
// Will auto-render. Uses moment-fork of JQuery DateTimePicker.
// `elementSelector` - CSS selector for the container element
// `options.onChange` - function callback triggered when time range is changed
//                      and applied. Args are function(startDate, endDate)
// `options.onLoad` - function callback triggered when rendered. Args are
//                    function(startDate, endDate)
// `options.startDate` - moment date for the start date
// `options.endDate` - moment date for the end date
class TimeRangePickerView {
  constructor(elementSelector, options = {}) {
    this.$el = $(elementSelector);
    this.$   = function() { return this.$el.find.apply(this.$el, arguments); }
    this.onChange  = options.onChange || function() {};
    this.onLoad    = options.onLoad || function() {};
    this.startDate = options.startDate || moment().subtract(12, 'hours');
    this.endDate   = options.endDate || moment();

    this.render();
    this.notifier  = new Notifier(".notifier");
  }

  render() {
    var $template = JST["time-range-picker"]();
    this.$el.html($template);

    this.$('.start-date').text(this.startDate.local());
    this.$('.end-date').text(this.endDate.local());

    this.$('.start-date-control').val(this.startDate.format(ISODateFormat));
    this.$('.end-date-control').val(this.endDate.format(ISODateFormat));

    this.onLoad(this.startDate, this.endDate);

    // Apply custom datetime picker for browsers who do not render their own
    if (this.$('[type="datetime"]').prop('type') !== 'datetime') {
      this.$('[type="datetime"]').datetimepicker({
        format: ISODateFormat,
        formatTime: 'HH:mm',
        formatDate: 'YYYY-MM-DD',
        hours12: false
      });
    }

    this.$(".start-date, .end-date").on("click", () => {
      this.$(".time-range-picker-controls").show();
    });

    this.$("button.set-past-hour").on("click", () => {
      this.notifier.clear();
      this.applyTimeRange(moment().subtract(1, 'hours'), moment());
    });

    this.$("button.set-past-day").on("click", () => {
      this.notifier.clear();
      this.applyTimeRange(moment().subtract(1, 'days'), moment());
    });

    this.$("button.set-past-week").on("click", () => {
      this.notifier.clear();
      this.applyTimeRange(moment().subtract(1, 'weeks'), moment());
    });

    this.$("button.set-past-month").on("click", () => {
      this.notifier.clear();
      this.applyTimeRange(moment().subtract(1, 'months'), moment());
    });

    this.$("button.apply-time-range").on("click", () => {
      this.notifier.clear();
      var newStartDate = moment(this.$('.start-date-control').val());
      var newEndDate   = moment(this.$('.end-date-control').val());

      this.applyTimeRange(newStartDate, newEndDate);
    });
  }

  // Check newStartDate and newEndDate for validity, then update the UI and
  // trigger the callback for a new time range.
  applyTimeRange(newStartDate, newEndDate) {
    if (!newStartDate.isValid() && !newEndDate.isValid()) {
      this.notifier.error("Start Date and End Date both have invalid formatting.");
    } else if (!newStartDate.isValid()) {
      this.notifier.error("Start Date has invalid formatting.");
    } else if (!newEndDate.isValid()) {
      this.notifier.error("End Date has invalid formatting.");
    } else {
      this.startDate = newStartDate;
      this.endDate   = newEndDate;
      this.$(".time-range-picker-controls").hide();

      this.$('.start-date').text(this.startDate.local());
      this.$('.end-date').text(this.endDate.local());

      this.onChange(this.startDate, this.endDate);
    }
  }
}

export default TimeRangePickerView;
