const fs = require('fs');
const path = require("path");

const envConfig = JSON.parse(fs.readFileSync(path.join(process.cwd(), `/src/config/config.json`)));

class GlobalMethods {

  // TODO: Naming convention
  static loadConfig = (keys, packageName = null) => {
    const configKey = packageName.split('/').length == 1 ? packageName : packageName.split('/')[1].toUpperCase();
    return keys.map(key => {
      return configKey && envConfig[configKey] ? envConfig[configKey][key] ? envConfig[configKey][key] : envConfig[key] : envConfig[key];
    });
  };

  static loadEmailTemplate(packageName, templateName) {
   return require(path.join(process.cwd(), `/njs2_modules/${packageName}/templates/${templateName}`));
   };

}

module.exports = GlobalMethods;