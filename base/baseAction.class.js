const { DEFAULT_LNG_KEY } = require("@njs2/base/lib/constants");
const path = require("path");
const BASE_RESPONSE_DEFAULT_LNG = require(path.resolve(process.cwd(), `src/global/i18n/response/response.${DEFAULT_LNG_KEY}.js`)).RESPONSE;
const PROJECT_RESPONSE_DEFAULT_LNG = require(`../lib/i18n/response/response.${DEFAULT_LNG_KEY}.js`).RESPONSE;
const BASE_STRING_DEFAULT_LNG = require(path.resolve(process.cwd(), `src/global/i18n/string/string.${DEFAULT_LNG_KEY}.js`)).STRING;
const PROJECT_STRING_DEFAULT_LNG = require(`../lib/i18n/string/string.${DEFAULT_LNG_KEY}.js`).STRING;

class baseAction {

  //TODO: Check the member variable
  constructor() {
    this.responseCode = '';
  }

  setResponse(responseCode, options) {
    this.responseCode = responseCode;
    this.responseOptions = options;
    return true;
  }

  getResponse() {
    let RESP;
    try {
      if (this.lng_key) {
        RESP = require(path.resolve(process.cwd(), `src/global/i18n/response/response.${this.lng_key}.js`)).RESPONSE;
        RESP = { ...RESP, ...require(`../lib/i18n/response/response.${this.lng_key}.js`).RESPONSE };
      } else throw new Error('Fallback to default language');
    } catch (e) {
      RESP = { ...PROJECT_RESPONSE_DEFAULT_LNG, ...BASE_RESPONSE_DEFAULT_LNG };
    }

    if (!RESP[this.responseCode]) {
      RESP = RESP["RESPONSE_CODE_NOT_FOUND"];
    } else {
      RESP = RESP[this.responseCode];
    }

    this.responseCode = RESP.responseCode;
    this.responseMessage = RESP.responseMessage;

    if (this.responseOptions)
      Object.keys(this.responseOptions).map(keyName => {
        this.responseMessage = this.responseMessage.replace(keyName, this.responseOptions[keyName]);
      });

    return {
      responseCode: this.responseCode,
      responseMessage: this.responseMessage
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
    let RESP;
    try {
      if (this.lng_key) {
        RESP = require(path.resolve(process.cwd(), `src/global/i18n/response/response.${this.lng_key}.js`)).RESPONSE;
        RESP = { ...RESP, ...require(`../lib/i18n/response/response.${this.lng_key}.js`).RESPONSE };
      } else throw new Error('Fallback to default language');
    } catch (e) {
      RESP = { ...PROJECT_RESPONSE_DEFAULT_LNG, ...BASE_RESPONSE_DEFAULT_LNG };
    }

    return Object.keys(RESP).map(res => RESP[res]);
  }
  // TODO: revisit later to reposition this function/responsibilities
  getStringValue(key) {
    let STR = '';
    try {
      if (this.lng_key) {
        STR = require(path.resolve(process.cwd(), `src/global/i18n/string/string.${this.lng_key}.js`)).STRING;
        if (!STR[key])
          STR = require(`../lib/i18n/string/string.${this.lng_key}.js`).STRING;
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