const SOCKET_SYSTEM = {
  "API_GATEWAY": {
    emit: require('./sockets/API_GATEWAY/index').emit
  },
  "SOCKET_IO": {
    init: require('./sockets/SOCKET_IO/index').init,
    emit: require('./sockets/SOCKET_IO/index').emit
  }
};

module.exports.sockets = SOCKET_SYSTEM;
module.exports.Executor = require('./base/executor.class');