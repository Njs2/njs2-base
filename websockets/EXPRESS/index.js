const pjson = require('../../package.json');
const { loadConfig } = require("../../base/loadConfig");
const path = require('path');
const {
  SOCKET_PORT
} = loadConfig(["SOCKET_PORT"], pjson.name);

const io = require("socket.io")({
  serveClient: false,
  transports: ['websocket'],
  cors: {
    origin: '*',
  }
});

const server = require("http").createServer();

io.attach(server, {
  pingInterval: 10000,
  pingTimeout: 5000,
  cookie: false
});


const init = () => {
  io.on('connection', function (socket) {
    const id = socket.id;
    console.log('Socket connected :: ', id);
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
      console.log('Socket Closing :: ', id);

      // Invoke disconnect handler from project
      require(path.resolve(process.cwd(), 'listener.js')).disconnectHandler({
        requestContext: {
          connectionId: id
        }
      });
    });

    // Invoke connection handler from project
    require(path.resolve(process.cwd(), 'listener.js')).connectHandler({
      requestContext: {
        connectionId: id
      }
    });
  });

  server.listen(SOCKET_PORT, () => {
    console.log("Socket server started at port: ", SOCKET_PORT);
  });
}


const emit = async (connectionId, payload) => {
  try {
    if (!connectionId) return;
    io.to(connectionId).emit('message', payload);
  } catch (e) {
    console.log("Socket Emit error:", e);
  }
}

module.exports = {
  init: init,
  emit: emit
}