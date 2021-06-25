require('bytenode');
const path = require('path');
const wssEvents = require(path.join(process.cwd(), "src/config/listener.json"));
require("njs2-base/base/env");
const dbManager = require("njs2-base/package/dbManager").dbManager;

module.exports.sockets = async (event) => {
  try {
    const body = typeof event.body == "string" ? JSON.parse(event.body) : event.body;
    const action = body.action;
    const accessToken = body.access_token;
    let userObj;

    // Map required route path
    const requestMap = wssEvents.filter(request => {
      return request.event == action;
    });

    if (requestMap.length == 0) {
      return { statusCode: 403, body: 'event not found' };
    }

    const validatedUser = await dbManager.verifyAccessToken(accessToken);
    if (!validatedUser) {
      return { code: 403, body: 'Invalid access_token' };
    }
    userObj = validatedUser;

    // Import route handler and execute
    const execute = require(requestMap[0].handler);
    await execute.handler(body, userObj);
    return { statusCode: 200, body: {} };
  } catch (e) {
    console.log(e);
    return { statusCode: 500, body: 'Internal server error' };
  }
}