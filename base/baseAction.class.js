const path = require("path");
const Autoload = require('./autoload.class');
const loadResponse = require('./loadResponse').loadResponse;
require("bytenode");
loadResponse(require('../lib/response').RESPONSE);
loadResponse(require(path.resolve(process.cwd(), `src/global/response.js`)).RESPONSE);

class baseAction {

  setResponse(code, options = [], packageName) {
    const pkgName = packageName && packageName.indexOf('@') == 0 ? packageName.split('/')[0].substring(1) : packageName;
    let RESP = pkgName ? global.RESPONSE[`${pkgName}-${code}`] ? global.RESPONSE[`${pkgName}-${code}`] : global.RESPONSE[`${code}`] : global.RESPONSE[`${code}`];

    if (!RESP) {
      RESP = global.RESPONSE["RESPONSE_CODE_NOT_FOUND"];
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
}

module.exports = baseAction;