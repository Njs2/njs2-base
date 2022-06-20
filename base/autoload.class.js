const path = require('path');
SQLManager = null;
MONGOManager = null;
REDISManager = null;
// TODO: Naming convention
GLB = null;
SOCKETManager = null;

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
    SOCKETManager = require("../sockets/index").sockets;
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
        MONGOManager = require('@njs2/mongo');
      }else if(module == '@njs2/redis'){
        REDISManager = require('@njs2/redis');
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
      const LibClass = require(path.resolve(process.cwd(), `src/library/${type}/${library}.lib.js`));
      return new LibClass();
    });
  };

  static loadEmailTemplate(packageName, templateName) {
   return require(process.cwd(),"njs2_modules/"+packageName+"templates/"+templateName);
  };
}

module.exports = autoLoad;