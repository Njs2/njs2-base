const pjson = require('./package.json');
const baseHelepr = require('./helper/baseHelper.class');
const [
  SOCKET_SYSTEM_TYPE
] = baseHelepr.loadConfig(["SOCKET_SYSTEM_TYPE"], pjson.name);

const SOCKET_SYSTEM = {
  "API_GATEWAY": {
    emit: require('./sockets/API_GATEWAY/index').emit
  },
  "SOCKET_IO": {
    init: require('./sockets/SOCKET_IO/index').init,
    emit: require('./sockets/SOCKET_IO/index').emit
  }
};

module.exports.sockets = SOCKET_SYSTEM[SOCKET_SYSTEM_TYPE];
module.exports.Executor = require('./base/executor.class');