const path = require("path");
const io = require("socket.io")({
  serveClient: false,
  transports: ["websocket"],
  cors: {
    origin: "*",
  },
});

const server = require("http").createServer();

io.attach(server, {
  pingInterval: 10000,
  pingTimeout: 5000,
  cookie: false,
});

const init = () => {
  io.on("connection", function (socket) {
    const id = socket.id;
    console.log("Socket connected :: ", id);
    socket.on("message", function (msg) {
      const message = typeof msg == "string" ? JSON.parse(msg) : msg;
      require(path.resolve(process.cwd(), "socketio.js")).handler({
        requestContext: {
          connectionId: id,
          eventType: "MESSAGE",
        },
        body: message,
      });
    });

    socket.on("disconnect", function () {
      console.log("Socket Closing :: ", id);

      // Invoke disconnect handler from project
      require(path.resolve(process.cwd(), "socketio.js")).handler({
        requestContext: {
          connectionId: id,
          eventType: "DISCONNECT",
        },
      });
    });

    // Invoke connection handler from project
    let { EIO, transport, access_token, ...queryData } = socket.handshake.query;

    require(path.resolve(process.cwd(), "socketio.js")).handler({
      requestContext: {
        connectionId: id,
        eventType: "CONNECT",
      },

      access_token,

      queryData,
    });
  });

  server.listen(process.env.SOCKET_PORT, () => {
    console.log("Socket server started at port: ", process.env.SOCKET_PORT);
  });
};

const emit = async (connectionId, payload) => {
  try {
    if (!connectionId) return;
    io.to(connectionId).emit("message", payload);
  } catch (e) {
    console.log("Socket Emit error:", e);
  }
};

module.exports = {
  init: init,
  emit: emit,
};
