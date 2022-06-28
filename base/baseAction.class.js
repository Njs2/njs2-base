const { DEFAULT_LNG_KEY } = require("../helper/globalConstants");
const path = require("path");
const fs = require("fs");
const BASE_STRING_DEFAULT_LNG = require(path.resolve(process.cwd(), `src/global/i18n/string/string.${DEFAULT_LNG_KEY}.js`)).STRING;
const PROJECT_STRING_DEFAULT_LNG = require(`../i18n/strings/string.${DEFAULT_LNG_KEY}.js`).STRING;
require('bytenode');
class baseAction {

  //TODO: Check the member variable
  constructor() {
    this.responseString = '';
    this.responseOptions = {};
  }

  setResponse(responseString, options, packageName) {
    this.responseString = responseString;
    this.responseOptions = options;
    this.packageName = packageName;
    return true;
  }

  getResponseString() {
    return {
      responseString: this.responseString,
      responseOptions: this.responseOptions ? this.responseOptions : {},
      packageName: this.packageName
    };
  }

  setMemberVariable(paramName, value) {
    this[`${paramName}`] = value;
    return true;
  }
  
  loadPkg(packageName) {
    let packageVal = packageName.split('/');
    let packageJsonData = require(path.resolve(
      process.cwd(),
      `njs2_modules/${packageVal[0]}/package.json`
    ));
    if(packageJsonData['njs2-type'] === "endpoint") {
      let packageVals = packageName.split('/');
      return require(path.resolve(
        process.cwd(),
        `njs2_modules/${[...packageVals.slice(0, packageVals.length - 1), "methods", ...packageVals.slice(packageVals.length - 1)].join('/')}/index`
      ))();
    }else if(packageJsonData['njs2-type'] === "helper") {
      return require(path.resolve(
        process.cwd(),
        `njs2_modules/${packageName}/index`
      ));
    }
 
  }
  static loadTask(packageName,mCronDetails){
    return require(path.join(process.cwd(),"njs2_modules/" +
    packageName +
    "/task/" +
    mCronDetails.name +
    ".task"));
    }
  // TODO: revisit later to reposition this function/responsibilities
  getResponseList() {
    const BASE_RESPONSE = require(path.resolve(process.cwd(), `src/global/i18n/response.js`)).RESPONSE;
    const PROJECT_RESPONSE = require(`../i18n/response.js`).RESPONSE;

    let RESP = [...Object.values(PROJECT_RESPONSE), ...Object.values(BASE_RESPONSE)];
    const packageJson = require(path.resolve(process.cwd(), 'package.json'));
    Object.keys(packageJson.dependencies).map(pkg => {
      console.log(path.resolve(process.cwd(), `njs2_modules/${pkg}/contract/response.json`));
      if (fs.existsSync(path.resolve(process.cwd(), `njs2_modules/${pkg}/contract/response.json`))) {
        const pkgPath = path.resolve(process.cwd(), `njs2_modules/${pkg}/contract/response.json`);
        const pkgResponse = require(pkgPath);
        RESP = [...RESP, ...Object.values(pkgResponse)];
      }
    });

    return RESP;
  }

  // TODO: revisit later to reposition this function/responsibilities
  getStringValue(key, lngKey = this.lngKey) {
    let STR = '';
    try {
      if (lngKey) {
        STR = require(path.resolve(process.cwd(), `src/global/i18n/string/string.${lngKey}.js`)).STRING;
        if (!STR[key])
          STR = require(`../i18n/strings/string.${lngKey}.js`).STRING;
      } else throw new Error('Fallback to default language');
    } catch (e) {
      STR = BASE_STRING_DEFAULT_LNG;
      if (!STR[key])
        STR = PROJECT_STRING_DEFAULT_LNG;
    }

    return STR[key];
  }
}

module.exports = baseAction;