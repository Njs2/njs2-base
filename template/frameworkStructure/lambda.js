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
    } else if (requestType === 'mCron') {
      // get the taskName
      const taskName = event.stageVariables.taskName;
      // require the file by taskName
      const mCron = require(`./src/tasks/${taskName}.task.js`);
      // call default of taskName
      mCron();
    } else if (requestType === 'cron') {
      const cron = require(`./cron`);
      cron();
    }
  } catch (error) {
    console.error(error);
  }
};