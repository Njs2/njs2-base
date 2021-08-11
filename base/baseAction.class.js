require("bytenode");
const { DEFAULT_LNG_KEY } = require("@njs2/base/lib/constants");
const path = require("path");
const Autoload = require('./autoload.class');
const BASE_RESPONSE_DEFAULT_LNG = require(path.resolve(process.cwd(), `src/global/i18n/response/response.${DEFAULT_LNG_KEY}.js`)).RESPONSE;
const PROJECT_RESPONSE_DEFAULT_LNG = require(`../lib/i18n/response/response.${DEFAULT_LNG_KEY}.js`).RESPONSE;
const BASE_STRING_DEFAULT_LNG = require(path.resolve(process.cwd(), `src/global/i18n/string/string.${DEFAULT_LNG_KEY}.js`)).STRING;
const PROJECT_STRING_DEFAULT_LNG = require(`../lib/i18n/string/string.${DEFAULT_LNG_KEY}.js`).STRING;

class baseAction {

  setResponse(code, options = [], packageName) {
    // const pkgName = packageName && packageName.indexOf('@') == 0 ? packageName.split('/')[0].substring(1) : packageName;
    // let RESP = pkgName && global.RESPONSE[`${pkgName}-${code}`] ? global.RESPONSE[`${pkgName}-${code}`] : global.RESPONSE[`${code}`];
    let RESP;
    try {
      if (this.lng_key) {
        RESP = require(path.resolve(process.cwd(), `src/global/i18n/response/response.${this.lng_key}.js`)).RESPONSE;
        if (!RESP[code])
          RESP = require(`../lib/i18n/response/response.${this.lng_key}.js`).RESPONSE;
      } else throw new Error('Fallback to default language');
    } catch (e) {
      RESP = BASE_RESPONSE_DEFAULT_LNG;
      if (!RESP[code])
        RESP = PROJECT_RESPONSE_DEFAULT_LNG;
    }

    if (!RESP[code]) {
      RESP = RESP["RESPONSE_CODE_NOT_FOUND"];
    } else {
      RESP = RESP[code];
    }

    Autoload.responseCode = RESP.responseCode;
    Autoload.responseMessage = RESP.responseMessage;

    for (let keyName in options) {
      Autoload.responseMessage = Autoload.responseMessage.replace(keyName, options[`${keyName}`]);
    }
    return true;
  }

  setDebugMessage(msg) {
    Autoload.responseMessage = msg;
  }

  setMemberVariable(paramName, value) {
    this[`${paramName}`] = value;
    return true;
  }

  loadPkg(packageName) {
    return require(path.resolve(process.cwd(), `Njs2-modules/${packageName.indexOf('@') == 0 ? packageName.split('/').join('/methods/').substring(1) : packageName}`))();
  }

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