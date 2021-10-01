const path = require('path');
SQLManager = null;
MongoManager = null;
// TODO: Naming convention
GLB = null;

class autoLoad {

  // TODO: Naming convention
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

    GLB = require(path.join(process.cwd(), "src/global/index.js"));
  };

  static loadModules(moduleList = []) {
    // Load public packages to be called from the action.js
    if (moduleList.length) {
      return moduleList.map(module => {
        return module;
      });
    }

    const projectPackageJson = require(path.join(process.cwd(), `/package.json`));
    Object.keys(projectPackageJson.dependencies).forEach((module) => {
      if (module == '@njs2/sql') {
        SQLManager = require('@njs2/sql');
      } else if (module == '@njs2/mongo') {
        MongoManager = require('@njs2/mongo');
      }
    });
  };

  static loadSqlLibray(sqlLibraryList) {
    return sqlLibraryList.map(sqlLibrary => {
      return require(path.resolve(process.cwd(), `src/library/sqlLib/${sqlLibrary}.lib.js`)).getInstance();
    });
  };

  static loadLibray(type, libraryList) {
    return libraryList.map(library => {
      return require(path.resolve(process.cwd(), `src/library/${type}/${library}.lib.js`)).getInstance();
    });
  };
}

module.exports = autoLoad;