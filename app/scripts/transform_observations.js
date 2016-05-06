// Convert array of SensorThings Observation objects into data for NVD3
var moment = require('moment');

window.transformObservations = function(observations) {
  return observations.map(function(observation) {
    var timestamp = moment(observation.get("phenomenonTime")).valueOf();
    return { x: timestamp, y: parseFloat(observation.get("result")) };
  }).sort(function(a, b) {
    return +(a.x > b.x) || +(a.x === b.x) - 1;
  });
};
