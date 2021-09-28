module.exports.handler = async (event, user) => {
  try {
    const { sockets: njsWebsocket } = require('@njs2/base');
    await njsWebsocket.emit(user.socket_id, { "event": 'pong' });
    return { statusCode: 200, body: {} };
  } catch (e) {
    console.log(e);
  }
  return { statusCode: 500, body: 'Failed to connect' };
}