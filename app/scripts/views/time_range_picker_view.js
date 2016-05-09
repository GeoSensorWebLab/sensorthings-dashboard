class TimeRangePickerView {
  constructor(elementSelector) {
    this.$el = $(elementSelector);
    var $template = JST["time-range-picker"]();
    this.$el.html($template);

    if (this.$el.find('[type="datetime"]').prop('type') !== 'datetime') {
      this.$el.find('[type="datetime"]').datetimepicker();
    }
  }
}

export default TimeRangePickerView;
