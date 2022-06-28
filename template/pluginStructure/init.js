
class <method-name>Initalize extends baseInitialize {

  constructor() {
    super();
    this.pkgInitializer =  this.loadIntializer("<lib-name>");
    this.initializer = {};
    this.initializer.isSecured = this.pkgInitializer.isSecured; // values: true/false
    this.initializer.requestMethod = this.pkgInitializer.requestMethod; // requestMethod: ['GET', 'POST', 'PUT', 'DELETE']
  }

  getParameter() {
    const param = {
    };

    return { ...this.pkgInitializer.param, ...param };
  }
}

module.exports = <method-name>Initalize;