require('bytenode');
require("@njs2/base/base/env");
const Executor = require("@njs2/base/base/executor.class");
const { sockets: njsWebsocket } = require('@njs2/base');

/* eslint-disable-next-line no-unused-vars */
module.exports.connectHandler = async (event) => {
  try {
    return { code: 200, body: {} };
  } catch (e) {
    console.log(e);
  }
  return { statusCode: 500, body: 'Failed to connect' };
}

/* eslint-disable-next-line no-unused-vars */
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
    wsEvent.requestId = body.request_id;
    wsEvent.headers = body.headers && typeof body.headers == 'object' ? body.headers : {};
    wsEvent.pathParameters = {
      proxy: body.action
    };

    if (body.method == 'GET') {
      wsEvent.queryStringParameters = body.body;
    } else if (body.method == 'POST') {
      wsEvent.body = body.body;
    }

    const executor = new Executor();
    await executor.executeMethod(wsEvent);
    await njsWebsocket.emit(event.requestContext.connectionId, { "request_id": body.request_id, "body": executor.getResponse() });
    return { statusCode: 200, body: {} };
  } catch (e) {
    console.log(e);
    await njsWebsocket.emit(event.requestContext.connectionId, { "request_id": body.request_id, 'error': 'Invalid Request' });
    return { statusCode: 500, body: 'Internal server error' };
  }
}