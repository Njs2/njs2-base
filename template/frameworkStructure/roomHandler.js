const awsHelper = require('@njs2/base/helper/awsHelper');

const handler = () => {
  setTimeout(async () => {
    try {
      // eslint-disable-next-line no-undef
      const roomList = await roomLib.getActiveRooms(); // This will be based on projects
      await Promise.all(roomList.map(async room => {
        if (process.env.SERVER_MODE === 'LAMBDA') {
          const AWS = require('aws-sdk');
          const credentials = awsHelper.getCrossAccountCredentials();
          const Lambda = new AWS.Lambda(credentials);
          const result = await Lambda.invoke({ // eslint-disable-line no-unused-vars
            FunctionName: process.env.LAMBDA_FUNCTION_NAME,
            InvocationType: "RequestResponse",
            Payload: JSON.stringify({
              stageVariables: {
                requestType: "processRoom",
                connectionURL: process.env.WEB_SOCKET_URL
              },
              content: room
            })
          }).promise();
          // Update result to Database
        } else if (process.env.SERVER_MODE === 'LOCAL') {
          const init = require('./src/library/roomHandler/init');
          const result = await init(room); // eslint-disable-line no-unused-vars
          // Update result to database
        }
      }));
    } catch {
    }
    handler();
  }, 1000);
}

handler();