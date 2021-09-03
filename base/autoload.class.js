const path = require('path');
SQLManager = null;
MongoManager = null;

class autoLoad {

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

  static loadModules() {
    const projectPackageJson = require(path.join(process.cwd(), `/package.json`));
    projectPackageJson.dependencies.forEach((module) => {
      if (module == '@njs2/sql') {
        SQLManager = require('@njs2/sql');
      } else if (module == '@njs2/mongo') {
        MongoManager = require('@njs2/mongo');
      }
    });

    /* TODO: Load modules method(SQL, MONGO) */
  };

  static loadPackages() {
  };
}

module.exports = autoLoad;