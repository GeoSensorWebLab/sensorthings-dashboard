class Datastream {
  constructor(data) {
    // Copy properties to this instance
    this.attributes = data;
  }

  get(key) {
    return this.attributes[key];
  }

  set(key, value) {
    this.attributes[key] = value;
  }
}

export default Datastream;
