const { DEFAULT_LNG_KEY } = require("../helper/globalConstants");
const path = require("path");
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
    let packageVals = packageName.split('/');
    return require(path.resolve(
      process.cwd(),
      `njs2_modules/${[...packageVals.slice(0, packageVals.length - 1), "methods", ...packageVals.slice(packageVals.length - 1)].join('/')}/index`
    ))();
  }
  // TODO: revisit later to reposition this function/responsibilities
  // TODO: Read response from packages
  getResponseList() {
    const BASE_RESPONSE = require(path.resolve(process.cwd(), `src/global/i18n/response.js`)).RESPONSE;
    const PROJECT_RESPONSE = require(`../i18n/response.js`).RESPONSE;

    let RESP = { ...PROJECT_RESPONSE, ...BASE_RESPONSE };

    return Object.keys(RESP).map(res => RESP[res]);
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