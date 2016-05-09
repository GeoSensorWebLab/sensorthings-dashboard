class TimeRangePickerView {
  constructor(elementSelector) {
    var $template = JST["time-range-picker"]();
    $(elementSelector).html($template);
  }
}

export default TimeRangePickerView;
