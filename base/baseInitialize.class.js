const path = require('path');
class baseInitialize {

  loadIntializer(packageName) {
    return require(path.resolve(process.cwd(), `Njs2-modules/${packageName.indexOf('@') == 0 ? packageName.split('/').join('/methods/').substring(1) : packageName}/params.json`));
  }
}

module.exports = baseInitialize;