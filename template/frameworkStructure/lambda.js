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
      // get the taskName from AWS EventBridge
      const taskName = event.stageVariables.taskName;
      // require the file by taskName
      const task = require(`./src/tasks/${taskName}.task.js`);
      // call default of taskName
      task();
    }
  } catch (error) {
    console.error(error);
  }
};