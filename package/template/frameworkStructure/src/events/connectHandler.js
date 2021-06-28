require('bytenode');
module.exports.connectHandler = async (event) => {
  try {
    const { access_token: accessToken } = event.queryStringParameters;
    const { sockets: websocketBase } = require('njs2-base');
    const res = await websocketBase.connect(accessToken, event.requestContext.connectionId);

    if (res) {
      console.log(`User connected ${res.user.user_id}`);
      return { statusCode: res.code, body: res.body };
    }
  } catch (e) {
    console.log(e);
  }
  return { statusCode: 500, body: 'Failed to connect' };
}