require('bytenode');
require("njs2-base/base/env");
const Executor = require("njs2-base/base/executor.class");

module.exports.connectHandler = async (event) => {
  try {
    return { code: 200, body: {} };
  } catch (e) {
    console.log(e);
  }
  return { statusCode: 500, body: 'Failed to connect' };
}


module.exports.disconnectHandler = async (event) => {
  try {
    return { code: 200, body: {} };
  } catch (e) {
    console.log(e);
  }
  return { statusCode: 500, body: 'Failed to disconnect' };
}


module.exports.sockets = async (event) => {
  const body = typeof event.body == "string" ? JSON.parse(event.body) : event.body;
  try {
    let wsEvent = {};
    wsEvent.httpMethod = body.method;
    if (body.method == 'GET') {
      wsEvent.queryStringParameters = body.body;
    } else if (body.method == 'POST') {
      wsEvent.body = body.body;
    }

    wsEvent.pathParameters = {
      proxy: body.action
    };
    wsEvent.headers = body.headers && typeof body.headers == 'object' ? body.headers : {};

    const executor = new Executor();
    await executor.executeMethod(wsEvent);
    const { sockets: njsWebsocket } = require('njs2-base');
    await njsWebsocket.emit(event.requestContext.connectionId, { "action": body.action, 'method': body.method, "body": executor.getResponse() });
    return { statusCode: 200, body: {} };
  } catch (e) {
    console.log(e);
    await njsWebsocket.emit(event.requestContext.connectionId, { "action": body.action, 'method': body.method, 'error': 'Invalid Request' });
    return { statusCode: 500, body: 'Internal server error' };
  }
}