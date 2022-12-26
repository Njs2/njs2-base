const path = require('path');
const merge = require('deepmerge')
SQLManager = null;
MONGOManager = null;
REDISManager = null;
// TODO: Naming convention
GLB = null;
SOCKETManager = null;

class autoLoad {

  // TODO: Naming convention
  static loadConfig() {
    try {

      let finalConfigs = {}
      const projectConfigs = require(path.join(process.cwd(), `src/config/config.json`));
      for (const k in projectConfigs) {
          if (typeof projectConfigs[k] == "object") {
              finalConfigs[k] = projectConfigs[k];
          } else {
              const projectConfigValue = `${projectConfigs[k]}`
              if(projectConfigValue && projectConfigValue.startsWith("__")) {
                  finalConfigs[k] = "";
              } else {
                  finalConfigs[k] = projectConfigValue;
              }
              
          }
      }
      const customConfigs = require(path.join(process.cwd(), `/custom_config.json`));
      for (const k in customConfigs) {
          if (finalConfigs[k] !== undefined) {
            if (typeof customConfigs[k] == "object") {
                finalConfigs[k] = JSON.stringify(merge(finalConfigs[k], customConfigs[k]))
            } else {
                finalConfigs[k] = customConfigs[k];
            }
          } else {
              throw new Error(`${k} not found in config.json!`)
          }
      }

      process.env = {...process.env, ...finalConfigs}

      console.log({...process.env})

      // Load Constrants to GLB
      GLB = require(path.join(process.cwd(), "src/global/index.js"));
      // Load Realtime Method(s) to SOCKETManager
      SOCKETManager = require("../sockets/index").sockets;
      
    
    } catch (error) {
        console.error("Cannot Continue processing API!")
        if (error.code == "MODULE_NOT_FOUND") {
            throw new Error("Either config.json or custom_config.json are not present!")
        } else {
            throw new Error(error)
        }
    }
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