const connect = async (accessToken, socketId) => {
  return { code: 200, body: {} };
}

const disconnect = async (socketId) => {
  return { code: 200, body: {} };
}

module.exports = {
  connect,
  disconnect
}