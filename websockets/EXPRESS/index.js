const pjson = require('../../package.json');
const { loadConfig } = require("../../base/loadConfig");
const {
  WSS_PORT
} = loadConfig(["WSS_PORT"], pjson.name);
const path = require('path');

const server = require('http').createServer();
const io = require('socket.io')(server);

const init = () => {
  io.on('connection', function (socket) {
    const id = socket.id;
    console.log('WS Socket connected :: ', id);
    socket.on('message', function (msg) {
      const message = typeof msg == "string" ? JSON.parse(msg) : msg;
      require(path.resolve(process.cwd(), 'listener.js')).sockets({
        requestContext: {
          connectionId: id
        },
        body: message
      });
    });

    socket.on('disconnect', function () {
      console.log('Websocket Closing :: ', id);

      // Invoke disconnect handler from project
      require(path.resolve(process.cwd(), 'listener.js')).disconnectHandler({
        requestContext: {
          connectionId: id
        }
      });
    });

    // Invoke connection handler from project
    require(path.resolve(process.cwd(), 'src/events/connectHandler.js')).connectHandler({
      requestContext: {
        connectionId: id
      }
    });
  });

  server.listen(WSS_PORT);
}


const emit = async (connectionId, payload) => {
  try {
    if (!connectionId) return;
    io.to(connectionId).emit('message', payload);
  } catch (e) {
    console.log("Websocket Emit error:", e);
  }
}

module.exports = {
  init: init,
  emit: emit
}