module.exports.getSQLConnection = require("./package/dbConnect").getSQLConnection;

const pjson = require('./package.json');
const { loadConfig } = require("./base/loadConfig");
const {
  SOCKET_SYSTEM_TYPE
} = loadConfig(["SOCKET_SYSTEM_TYPE"], pjson.name);
const SOCKET_SYSTEM = {
  "API_GATEWAY": {
    emit: require('./websockets/API_GATEWAY/index').emit,
    connect: require('./websockets/API_GATEWAY/websocketHandler').connect,
    disconnect: require('./websockets/API_GATEWAY/websocketHandler').disconnect
  },
  "EXPRESS": {
    init: require('./websockets/EXPRESS/index').init,
    emit: require('./websockets/EXPRESS/index').emit,
    connect: require('./websockets/EXPRESS/websocketHandler').connect,
    disconnect: require('./websockets/EXPRESS/websocketHandler').disconnect
  }
};

module.exports.sockets = SOCKET_SYSTEM[SOCKET_SYSTEM_TYPE];
module.exports.Executor = require('./base/executor.class');
