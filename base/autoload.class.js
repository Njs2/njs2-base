const path = require('path');
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

  static loadConfig() {
    const envConfig = require(path.join(process.cwd(), `/src/config/config.json`));

    for (const k in envConfig) {
      if (!process.env[k] || process.env[k].length == 0) {
        if (typeof envConfig[k] == "object") {
          process.env[k] = JSON.stringify(envConfig[k]);
        } else {
          process.env[k] = envConfig[k];
        }
      }
    }
  };
}

module.exports = autoLoad;