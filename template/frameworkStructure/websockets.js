// Import and load env files
AutoLoad = require('@njs2/base/base/autoload.class');
AutoLoad.loadConfig();
AutoLoad.loadModules();

// Import Executor class
const Executor = require("@njs2/base/base/executor.class");
const { sockets } = require('@njs2/base');
const njsWebsocket = sockets['API_GATEWAY'];
const { CONNECTION_HANDLER_METHOD, DISCONNECTION_HANDLER_METHOD } = require('./src/global/constants');

const executeRequests = async (connectionId, wsEvent, request_id) => {
  const executor = new Executor();
  const resp = await executor.executeRequest(wsEvent);
  if (request_id) await njsWebsocket.emit(connectionId, { "request_id": request_id, "body": resp });
};

/* eslint-disable-next-line no-unused-vars */
module.exports.connectHandler = async (event) => {
  try {
    let wsEvent = {};
    wsEvent.httpMethod = 'GET';
    wsEvent.requestId = null;
    wsEvent.headers = {};
    wsEvent.pathParameters = {
      proxy: CONNECTION_HANDLER_METHOD
    };

    if (CONNECTION_HANDLER_METHOD) await executeRequests(event.requestContext.connectionId, wsEvent);
    return { code: 200, body: {} };
  } catch (e) {
    console.log(e);
  }
  return { statusCode: 500, body: 'Failed to connect' };
}

/* eslint-disable-next-line no-unused-vars */
module.exports.disconnectHandler = async (event) => {
  try {
    let wsEvent = {};
    wsEvent.httpMethod = 'GET';
    wsEvent.requestId = null;
    wsEvent.headers = {};
    wsEvent.pathParameters = {
      proxy: DISCONNECTION_HANDLER_METHOD
    };

    if (DISCONNECTION_HANDLER_METHOD) await executeRequests(event.requestContext.connectionId, wsEvent);
    return { code: 200, body: {} };
  } catch (e) {
    console.log(e);
  }
  return { statusCode: 500, body: 'Failed to disconnect' };
}


module.exports.socketsHandler = async (event) => {
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

    await executeRequests(event.requestContext.connectionId, wsEvent, body.request_id);

    return { statusCode: 200, body: {} };
  } catch (e) {
    console.log(e);
    await njsWebsocket.emit(event.requestContext.connectionId, { "request_id": body.request_id, 'error': 'Invalid Request' });
    return { statusCode: 500, body: 'Internal server error' };
  }
}