const AWS = require('aws-sdk');
const pjson = require('../../package.json');
const baseHelper = require('../../helper/baseHelper.class');

const [
  WSS_BASE_URL,
  USE_LAMBDA_ROLE
] = baseHelper.loadConfig(["WSS_BASE_URL", "USE_LAMBDA_ROLE"], pjson.name);
const websocketHelper = require("./websocketHelper");

const emit = async (connectionId, payload) => {
  try {
    if (!connectionId) return;
    let credentials = USE_LAMBDA_ROLE ? {} : await websocketHelper.getCrossAccountCredentials();
    credentials.apiVersion = '2018-11-29';
    credentials.endpoint = WSS_BASE_URL;
    const apiGatewayManagementApi = new AWS.ApiGatewayManagementApi(credentials);
    await apiGatewayManagementApi.postToConnection({
      ConnectionId: connectionId,
      Data: JSON.stringify(payload),
    }).promise();
  } catch (e) {
    console.log("postToConnection API gateway error:", e);
  }
}

module.exports = {
  emit: emit
}