require('bytenode');
module.exports.handler = async (event, user) => {
  try {
    const njsWebsocket = require('njs2-websocket/index');
    await njsWebsocket.emit(user.socket_id, { "event": 'pong' });
    return { statusCode: 200, body: {} };
  } catch (e) {
    console.log(e);
  }
  return { statusCode: 500, body: 'Failed to connect' };
}