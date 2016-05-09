var ISODateFormat = 'YYYY-MM-DD[T]hh:mm:ssZ';

class TimeRangePickerView {
  constructor(elementSelector, options = {}) {
    this.$el = $(elementSelector);
    this.startDate = options.startDate || moment().subtract(12, 'hours');
    this.endDate   = options.endDate || moment();

    this.render();
  }

  render() {
    var $template = JST["time-range-picker"]();
    this.$el.html($template);

    this.$el.find('.start-time').text(this.startDate.local());
    this.$el.find('.end-time').text(this.endDate.local());

    this.$el.find('[name="start-date"]').val(this.startDate.format(ISODateFormat));
    this.$el.find('[name="end-date"]').val(this.endDate.format(ISODateFormat));

    // Apply custom datetime picker for clients who do not render their own
    if (this.$el.find('[type="datetime"]').prop('type') !== 'datetime') {
      this.$el.find('[type="datetime"]').datetimepicker({
        format: ISODateFormat,
        formatTime: 'hh:mm',
        formatDate: 'YYYY-MM-DD'
      });
    }

    $(".start-time, .end-time").on("click", () => {
      $(".time-range-picker-controls").show();
    });
  }
}

export default TimeRangePickerView;
