/* eslint-disable-next-line no-undef */
class <method-name>Initalize extends baseInitialize {

  constructor() {
    super();
    this.pkgInitializer =  {};
    this.pkgInitializer.isSecured = <is-secured>; // values: true/false
    this.pkgInitializer.requestMethod = '<method-type>'; // requestMethod: GET/POST or ['GET', 'POST', 'PUT', 'DELETE']
  }

  getParameter() {
    const param = {
      "inpVals": {
        "name": "inp_vals",
        "type": "string",
        "description": "inp_vals",
        "required": false,
        "default": ""
      },
    };

    return { ...param };
  }
}

module.exports = <method-name>Initalize;