const pjson = require('../package.json');
const baseHelepr = require('../helper/baseHelper.class');
const [
  SOCKET_SYSTEM_TYPE
] = baseHelepr.loadConfig(["SOCKET_SYSTEM_TYPE"], pjson.name);

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