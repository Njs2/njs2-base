
let autoLoadInstance = null;

class autoLoad {


  constructor() {
    this.responseCode;
    this.responseMessage;
    this.requestData;
    this.default_lng_key = "en";
    this.lng_key;
  }

  static getStaticInstance() {
    if (autoLoadInstance == null) {
      autoLoadInstance = new autoLoad()
    }
    return autoLoadInstance;
  }
}

module.exports = autoLoad;