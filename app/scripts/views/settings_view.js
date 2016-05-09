var SettingsView = (function() {
  $("#custom-url").val(Settings.getSensorThingsURL()).prop("disabled", false);

  $(".apply-settings").click(function() {
    var selectVal = $("#predefined-servers").val();

    if (selectVal === "other") {
      Settings.setSensorThingsURL($("#custom-url").val());
    } else {
      Settings.setSensorThingsURL(selectVal);
      $("#custom-url").val(selectVal);
    }
    Notify.success("SensorThings URL updated.");
  });
});

export default SettingsView;
