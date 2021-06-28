module.exports.getMongooseConnection = require("./package/dbConnect").getMongooseConnection;
module.exports.getSQLConnection = require("./package/dbConnect").getSQLConnection;
module.exports.sockets = {
  emit: require('./websockets/index').emit,
  connect: require('./websockets/websocketHandler').connect,
  disconnect: require('./websockets/websocketHandler').disconnect
};