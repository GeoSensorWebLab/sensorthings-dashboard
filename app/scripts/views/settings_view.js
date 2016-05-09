var SettingsView = (function() {
  $("#custom-url").val(App.Settings.getSensorThingsURL()).prop("disabled", false);

  $(".apply-settings").click(function() {
    var selectVal = $("#predefined-servers").val();

    if (selectVal === "other") {
      App.Settings.setSensorThingsURL($("#custom-url").val());
    } else {
      App.Settings.setSensorThingsURL(selectVal);
      $("#custom-url").val(selectVal);
    }
    Notify.success("SensorThings URL updated.");
  });
});

export default SettingsView;
