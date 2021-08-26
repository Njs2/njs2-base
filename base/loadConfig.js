//TODO: Revisit - 2 - HOLD
const fs = require('fs');
const path = require("path");

const envConfig = JSON.parse(fs.readFileSync(path.join(process.cwd(), `/src/config/config.json`)));
module.exports.loadConfig = (keys, packageName = null) => {
  let config = {};
  keys.map(key => {
    config[key] = packageName && envConfig[packageName] ? envConfig[packageName][key] ? envConfig[packageName][key] : envConfig[key] : envConfig[key];
  });
  return config;
};