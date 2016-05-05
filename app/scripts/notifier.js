window.Notify = {
  error(msg) {
    $("#notify > div").hide();
    $("#notify .error").show().html(msg);
  },

  success(msg) {
    $("#notify > div").hide();
    $("#notify .success").show().html(msg);
  },

  warning(msg) {
    $("#notify > div").hide();
    $("#notify .warning").show().html(msg);
  }
};
