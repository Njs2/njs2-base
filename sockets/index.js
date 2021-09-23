const pjson = require('../package.json');
const GlobalMethods = require('../helper/globalMethods');
const [
  SOCKET_SYSTEM_TYPE
] = GlobalMethods.loadConfig(["SOCKET_SYSTEM_TYPE"], pjson.name);

const SOCKET_SYSTEM = {
  "API_GATEWAY": {
    emit: require('./apigateway').emit
  },
  "SOCKET_IO": {
    init: require('./socketio').init,
    emit: require('./socketio').emit
  }
};

module.exports = {
  sockets: SOCKET_SYSTEM[SOCKET_SYSTEM_TYPE]
};