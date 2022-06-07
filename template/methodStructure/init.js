
class <method-name>Initalize extends baseInitialize {

  constructor() {
    super();
    this.initializer =  {};
    this.initializer.isSecured = <is-secured>; // values: true/false
    this.initializer.requestMethod = ['<method-type>']; // requestMethod: ['GET', 'POST', 'PUT', 'DELETE']
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