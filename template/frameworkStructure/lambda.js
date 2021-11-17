const serverless = require('./serverless'); 
const websockets = require('./websockets');
//const init = require('./src/library/roomHandler/init');  // Make sure to create this file and add defualt content.

module.exports.handler = async (event) => {
  try {
    const requestType = event.stageVariables.requestType;
    if (requestType === 'API') {
      return await serverless.execute(event);
    } else if (requestType === 'Socket') {
      return await websockets.handler(event);
    } else if (requestType === 'processRoom') {
      //return await init(event.content);
    } else if (requestType === 'scheduler') {

    }
  } catch (error) {
    console.error(error);
  }
};