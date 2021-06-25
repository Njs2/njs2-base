
let autoLoadInstance = null;

class autoLoad {


  constructor() {
    this.responseCode;
    this.responseMessage;
    this.requestData;
  }

  static getStaticInstance() {
    if (autoLoadInstance == null) {
      autoLoadInstance = new autoLoad()
    }
    return autoLoadInstance;
  }
}

module.exports = autoLoad;