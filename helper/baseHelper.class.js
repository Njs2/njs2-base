const path = require('path');

class baseHelper {

  loadConfig() {
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

module.exports = baseHelper;