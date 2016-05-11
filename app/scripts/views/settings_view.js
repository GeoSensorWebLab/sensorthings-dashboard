import Notifier from '../notifier';

class SettingsView {
  constructor() {
    var notifier = new Notifier("div#notify");
    $("#custom-url").val(App.Settings.getSensorThingsURL()).prop("disabled", false);

    $(".apply-settings").click(function() {
      var selectVal = $("#predefined-servers").val();

      if (selectVal === "other") {
        App.Settings.setSensorThingsURL($("#custom-url").val());
      } else {
        App.Settings.setSensorThingsURL(selectVal);
        $("#custom-url").val(selectVal);
      }
      notifier.success("SensorThings URL updated.");
    });
  }
}

export default SettingsView;
