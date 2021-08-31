const { DEFAULT_LNG_KEY } = require("../helper/globalConstants");
const path = require("path");
const BASE_STRING_DEFAULT_LNG = require(path.resolve(process.cwd(), `src/global/i18n/string/string.${DEFAULT_LNG_KEY}.js`)).STRING;
const PROJECT_STRING_DEFAULT_LNG = require(`../i18n/strings/string.${DEFAULT_LNG_KEY}.js`).STRING;

class baseAction {

  //TODO: Check the member variable
  constructor() {
    this.responseString = '';
    this.responseOptions = {};
  }

  setResponse(responseString, options) {
    this.responseString = responseString;
    this.responseOptions = options;
    return true;
  }

  getResponseString() {
    return {
      responseString: this.responseString,
      responseOptions: this.responseOptions ? this.responseOptions : {}
    };
  }

  setMemberVariable(paramName, value) {
    this[`${paramName}`] = value;
    return true;
  }

  loadPkg(packageName) {
    return require(path.resolve(
      process.cwd(),
      `Njs2-modules/${packageName.indexOf("@") == 0
        ? packageName.split("/").join("/methods/").substring(1)
        : packageName
      }`
    ))();
  }
  // TODO: revisit later to reposition this function/responsibilities
  getResponseList() {
    const BASE_RESPONSE = require(path.resolve(process.cwd(), `src/global/i18n/response/response.js`)).RESPONSE;
    const PROJECT_RESPONSE = require(`../lib/i18n/response/response.js`).RESPONSE;

    let RESP = { ...PROJECT_RESPONSE, ...BASE_RESPONSE };

    return Object.keys(RESP).map(res => RESP[res]);
  }
  // TODO: revisit later to reposition this function/responsibilities
  getStringValue(key) {
    let STR = '';
    try {
      if (this.lng_key) {
        STR = require(path.resolve(process.cwd(), `src/global/i18n/string/string.${this.lng_key}.js`)).STRING;
        if (!STR[key])
          STR = require(`../i18n/strings/string.${this.lng_key}.js`).STRING;
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