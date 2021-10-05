const serverless = require('./serverless');
const init = require('./src/library/roomHandler/init');
const websockets = require('./websockets');

module.exports.handler = async (event) => {
  try {
    const requestType = event.stageVariables.requestType;
    if (requestType === 'API') {
      return await serverless.execute(event);
    } else if (requestType === 'Socket') {
      let result = {};
      switch (event.requestContext.eventType) {
        case "CONNECT":
          result = await websockets.connectHandler(event);
          break;

        case "DISCONNECT":
          result = await websockets.disconnectHandler(event);
          break;

        case "MESSAGE":
          result = await websockets.socketsHandler(event);
          break;
      }
      return result;
    } else if (requestType === 'processRoom') {
      return await init(event.content);
    } else if (requestType === 'scheduler') {

    }
  } catch (error) {
    console.error(error);
  }
};