const path = require('path');
class baseInitialize {

  loadIntializer(packageName) {
    let packageVals = packageName.split('/');
    return require(path.resolve(process.cwd(), `njs2_modules/${[...packageVals.slice(0, packageVals.length - 1),  "methods",...packageVals.slice(packageVals.length - 1)].join('/')}/params.json`));
  }
}

module.exports = baseInitialize;