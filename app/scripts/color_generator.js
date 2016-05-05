function hashFnv32a(str, asString, seed) {
  /*jshint bitwise:false */
  var i, l,
  hval = (seed === undefined) ? 0x811c9dc5 : seed;

  for (i = 0, l = str.length; i < l; i++) {
    hval ^= str.charCodeAt(i);
    hval += (hval << 1) + (hval << 4) + (hval << 7) + (hval << 8) + (hval << 24);
  }
  if(asString) {
    // Convert to 8 digit hex string
    return ("0000000" + (hval >>> 0).toString(16)).substr(-8);
  }
  return hval >>> 0;
}

// return a deterministic line color for a given number.
// This causes each datastream to always receive the same line colour.
window.colorForId = function(id) {
  return hashFnv32a(id.toString(), true).substr(2, 8);
};
