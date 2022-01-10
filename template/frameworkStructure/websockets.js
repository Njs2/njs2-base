// Import and load env files
AutoLoad = require('@njs2/base/base/autoload.class');
AutoLoad.loadConfig();
AutoLoad.loadModules();

// Import Executor class
const { sockets, Executor } = require('@njs2/base');
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

    switch (event.requestContext.eventType) {
      case 'CONNECT':
        wsEvent.httpMethod = "GET";
        wsEvent.requestId = null;
        wsEvent.headers = event.queryStringParameters && event.queryStringParameters.access_token
        ? {
        access_token: event.queryStringParameters.access_token,
        }
        : {};
        wsEvent.pathParameters = {
        proxy: CONNECTION_HANDLER_METHOD,
        };
        if (
          event.queryStringParameters &&
          event.queryStringParameters.access_token
        )
          delete event.queryStringParameters.access_token;
        wsEvent.queryStringParameters = {
        socket_id: event.requestContext.connectionId,
        ...event.queryStringParameters,
        };
        CONNECTION_HANDLER_METHOD &&
        (await executeRequests(event.requestContext.connectionId, wsEvent));
        break ; 

      case 'DISCONNECT':
        wsEvent.httpMethod = 'GET';
        wsEvent.requestId = null;
        wsEvent.headers = {};
        wsEvent.pathParameters = {
          proxy: DISCONNECTION_HANDLER_METHOD
        };
        wsEvent.queryStringParameters = { socket_id: event.requestContext.connectionId }
        DISCONNECTION_HANDLER_METHOD && await executeRequests(event.requestContext.connectionId, wsEvent);
        break;

      case 'MESSAGE':
        wsEvent.httpMethod = body.method;
        wsEvent.requestId = body.request_id;
        wsEvent.headers = body.headers && typeof body.headers == 'object' ? body.headers : {};
        wsEvent.pathParameters = {
          proxy: body.action
        };
        if (body.method == 'GET') {
          wsEvent.queryStringParameters = { socket_id: event.requestContext.connectionId ,...body.body};
        } else if (body.method == 'POST') {
          wsEvent.body = body.body;
        }
        await executeRequests(event.requestContext.connectionId, wsEvent, requestId);
        break;
    }

    return { statusCode: 200, body: "SUCCESS" };
  } catch (e) {
    console.log(e);
    await sockets.emit(event.requestContext.connectionId, { "request_id": requestId, 'error': 'Invalid Request' });
    return { statusCode: 500, body: 'Internal server error' };
  }
}