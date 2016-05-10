// Class for managing notifications in an element.
// elementSelector should be an element with three `div` elements, with classes
// `error`, `success`, and `warning`.
class Notifier {
  constructor(elementSelector) {
    this.$element = $(elementSelector);
  }

  error(msg) {
    this.$element.children("div").hide();
    this.$element.find(".error").show().html(msg);
  }

  success(msg) {
    this.$element.children("div").hide();
    this.$element.find(".success").show().html(msg);
  }

  warning(msg) {
    this.$element.children("div").hide();
    this.$element.find(".warning").show().html(msg);
  }
}

export default Notifier;
