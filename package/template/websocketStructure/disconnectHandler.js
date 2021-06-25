require('bytenode');
module.exports.disconnectHandler = async (event) => {
  try {
    const websocketBase = require('njs2-websocket/websocketHandler');
    const res = await websocketBase.disconnect(event.requestContext.connectionId);

    if (res) {
      console.log(`User disconnected ${res.user.user_id}`);
      return { statusCode: res.code, body: res.body };
    }
  } catch (e) {
    console.log(e);
  }
  return { statusCode: 500, body: 'Failed to disconnect' };
}