AutoLoad = require('@njs2/base/base/autoload.class');
AutoLoad.loadConfig();
AutoLoad.loadModules();

const { Executor, sockets } = require("@njs2/base");
sockets.init();

const { CONNECTION_HANDLER_METHOD, DISCONNECTION_HANDLER_METHOD } = require('./src/global/constants');

const executeRequests = async (connectionId, wsEvent, request_id) => {
  const executor = new Executor();
  const resp = await executor.executeRequest(wsEvent);
  if (request_id) await sockets.emit(connectionId, { "request_id": request_id, "body": resp });
};

module.exports.handler = async (event) => {
  const body = typeof event.body == "string" ? JSON.parse(event.body) : event.body;
  const requestId = body ? body.request_id : null;

  try {
    let wsEvent = {};
    wsEvent.httpMethod = body.method;
    wsEvent.requestId = body.request_id;
    wsEvent.headers = body.headers && typeof body.headers == 'object' ? body.headers : {};

    switch (event.requestContext.eventType) {
      case 'CONNECT':
        wsEvent.pathParameters = {
          proxy: CONNECTION_HANDLER_METHOD
        };
        CONNECTION_HANDLER_METHOD && await executeRequests(event.requestContext.connectionId, wsEvent);
        break;

      case 'DISCONNECT':
        wsEvent.pathParameters = {
          proxy: DISCONNECTION_HANDLER_METHOD
        };
        DISCONNECTION_HANDLER_METHOD && await executeRequests(event.requestContext.connectionId, wsEvent);
        break;

      case 'MESSAGE':
        wsEvent.pathParameters = {
          proxy: body.action
        };
        if (body.method == 'GET') {
          wsEvent.queryStringParameters = body.body;
        } else if (body.method == 'POST') {
          wsEvent.body = body.body;
        }
        await executeRequests(event.requestContext.connectionId, wsEvent, requestId);
        break;
    }

    return { statusCode: 200, body: {} };
  } catch (e) {
    console.log(e);
    await sockets.emit(event.requestContext.connectionId, { "request_id": requestId, 'error': 'Invalid Request' });
    return { statusCode: 500, body: 'Internal server error' };
  }
}