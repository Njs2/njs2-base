const fs = require('fs');
const path = require("path");

const envConfig = JSON.parse(fs.readFileSync(path.join(process.cwd(), `/src/config/config.json`)));

class baseHelper {

  static loadConfig = (keys, packageName = null) => {
    return keys.map(key => {
      return packageName && envConfig[packageName] ? envConfig[packageName][key] ? envConfig[packageName][key] : envConfig[key] : envConfig[key];
    });
  };

}

module.exports = baseHelper;