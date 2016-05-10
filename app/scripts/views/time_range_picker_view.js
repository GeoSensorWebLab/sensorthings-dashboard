import Notifier from '../notifier';
var ISODateFormat = 'YYYY-MM-DD[T]HH:mm:ssZ';
var moment = require('moment');

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

    this.$el.find('.start-date').text(this.startDate.local());
    this.$el.find('.end-date').text(this.endDate.local());

    this.$el.find('.start-date-control').val(this.startDate.format(ISODateFormat));
    this.$el.find('.end-date-control').val(this.endDate.format(ISODateFormat));

    this.onLoad(this.startDate, this.endDate);

    // Apply custom datetime picker for clients who do not render their own
    if (this.$el.find('[type="datetime"]').prop('type') !== 'datetime') {
      this.$el.find('[type="datetime"]').datetimepicker({
        format: ISODateFormat,
        formatTime: 'HH:mm',
        formatDate: 'YYYY-MM-DD',
        hours12: false
      });
    }

    $(".start-date, .end-date").on("click", () => {
      $(".time-range-picker-controls").show();
    });

    $("button.apply-time-range").on("click", () => {
      this.notifier.clear();
      var newStartDate = moment(this.$el.find('.start-date-control').val());
      var newEndDate   = moment(this.$el.find('.end-date-control').val());

      if (!newStartDate.isValid() && !newEndDate.isValid()) {
        this.notifier.error("Start Date and End Date both have invalid formatting.");
      } else if (!newStartDate.isValid()) {
        this.notifier.error("Start Date has invalid formatting.");
      } else if (!newEndDate.isValid()) {
        this.notifier.error("End Date has invalid formatting.");
      } else {
        this.startDate = newStartDate;
        this.endDate   = newEndDate;
        $(".time-range-picker-controls").hide();

        this.$el.find('.start-date').text(this.startDate.local());
        this.$el.find('.end-date').text(this.endDate.local());

        this.onChange(this.startDate, this.endDate);
      }
    });
  }
}

export default TimeRangePickerView;
