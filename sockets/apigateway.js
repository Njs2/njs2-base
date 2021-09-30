const AWS = require('aws-sdk');
const pjson = require('../package.json');
const GlobalMethods = require('../helper/globalMethods');
const [
  WSS_BASE_URL,
  USE_LAMBDA_ROLE
] = GlobalMethods.loadConfig(["WSS_BASE_URL", "USE_LAMBDA_ROLE"], pjson.name);
const awsHelper = require("../helper/awsHelper");

const emit = async (connectionId, payload) => {
  try {
    if (!connectionId) return;
    let credentials = USE_LAMBDA_ROLE.toLowerCase() == "yes" ? {} : await awsHelper.getCrossAccountCredentials();
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