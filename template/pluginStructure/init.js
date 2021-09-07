class <method-name>Initalize extends baseInitialize {

  constructor() {
    super();
    this.pkgInitializer =  this.loadIntializer("<lib-name>");
    this.pkgInitializer.isSecured = this.pkgInitializer.isSecured; // values: true/false
    this.pkgInitializer.requestMethod = this.pkgInitializer.requestMethod; // requestMethod: GET/POST
  }

  getParameter() {
    const param = {
    };

    return { ...this.pkgInitializer.param, ...param };
  }
}

module.exports = <method-name>Initalize;