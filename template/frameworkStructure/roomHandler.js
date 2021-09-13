
// TODO: 
module.exports.handler = () => {
  setTimeout(async () => {
    try {
      const roomIds = await roomLib.getActiveRooms();
      await Promise.all(roomIds.map(async roomId => {
        if (process.env.SERVER_MODE === 'LAMBDA') {
          const AWS = require('aws-sdk');
          // Call lambda function for room init
          // Call lambda with room id in payload
          const Lambda = new AWS.Lambda({});
          const result = await Lambda.invoke({
            FunctionName: `serverless-framework-index`,
            InvocationType: "RequestResponse",
            Payload: JSON.stringify({
              room_id: roomId
            })
          }).promise();
          // Update result to redis and mongo
        } else if (process.env.SERVER_MODE === 'LOCAL') {
          const init = require('./src/library/roomHandler/init');
          const result = await init(roomId);
          // Update result to redis and mongo
        }
      }));
    } catch {
    }
    this.handler();
  }, 1000);
}